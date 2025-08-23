import * as XLSX from 'xlsx';

/**
 * Advanced file import utilities with validation and auto-correction
 */

/**
 * Import Excel file from URL with automatic updates
 * @param {string} url - URL to Excel file
 * @param {Function} onUpdate - Callback for when file is updated
 * @returns {Promise<Object>} - Imported data with validation results
 */
export const importFromURL = async (url, onUpdate = null) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const data = parseExcelData(arrayBuffer);

    // Set up polling for updates if callback provided
    if (onUpdate) {
      setupFilePolling(url, onUpdate, response.headers.get('last-modified'));
    }

    return {
      success: true,
      data: data.data,
      validation: data.validation,
      metadata: {
        url,
        lastModified: response.headers.get('last-modified'),
        size: arrayBuffer.byteLength,
        importedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null,
      validation: null
    };
  }
};

/**
 * Import multiple files and merge data
 * @param {Array} files - Array of file objects or URLs
 * @returns {Promise<Object>} - Merged and validated data
 */
export const importMultipleFiles = async (files) => {
  const results = [];
  const errors = [];

  for (const file of files) {
    try {
      let result;
      if (typeof file === 'string') {
        // URL
        result = await importFromURL(file);
      } else {
        // File object
        result = await importFile(file);
      }

      if (result.success) {
        results.push({
          name: file.name || file,
          data: result.data,
          validation: result.validation
        });
      } else {
        errors.push({
          name: file.name || file,
          error: result.error
        });
      }
    } catch (error) {
      errors.push({
        name: file.name || file,
        error: error.message
      });
    }
  }

  // Merge all successful imports
  const mergedData = mergeImportedData(results);

  return {
    success: errors.length === 0,
    data: mergedData,
    results,
    errors,
    summary: {
      totalFiles: files.length,
      successful: results.length,
      failed: errors.length
    }
  };
};

/**
 * Import single file with validation
 * @param {File} file - File to import
 * @returns {Promise<Object>} - Import result with validation
 */
export const importFile = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const parsed = parseExcelData(arrayBuffer);

    return {
      success: true,
      data: parsed.data,
      validation: parsed.validation,
      metadata: {
        name: file.name,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString(),
        type: file.type,
        importedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null,
      validation: null
    };
  }
};

/**
 * Parse Excel data with intelligent validation
 * @param {ArrayBuffer} arrayBuffer - Excel file data
 * @returns {Object} - Parsed data with validation results
 */
const parseExcelData = (arrayBuffer) => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheets = {};
  const validation = {
    issues: [],
    suggestions: [],
    corrected: [],
    confidence: 0
  };

  // Process each sheet
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rawData.length === 0) {
      validation.issues.push({
        type: 'empty_sheet',
        sheet: sheetName,
        message: `Planilha '${sheetName}' está vazia`
      });
      return;
    }

    // Detect and validate headers
    const headerValidation = validateHeaders(rawData[0], sheetName);
    validation.issues.push(...headerValidation.issues);
    validation.suggestions.push(...headerValidation.suggestions);
    validation.corrected.push(...headerValidation.corrected);

    // Convert to objects with corrected headers
    const headers = headerValidation.correctedHeaders || rawData[0];
    const dataRows = rawData.slice(1);

    const processedData = dataRows.map((row, index) => {
      const obj = {};
      headers.forEach((header, colIndex) => {
        if (header && row[colIndex] !== undefined) {
          obj[header] = processValue(row[colIndex], header, sheetName, index + 2, validation);
        }
      });

      // Add computed fields
      if (obj.data) {
        obj.semana = calculateWeekFromDate(obj.data);
      }

      return obj;
    }).filter(row => Object.keys(row).length > 0);

    // Validate data consistency
    validateDataConsistency(processedData, sheetName, validation);

    sheets[sheetName] = processedData;
  });

  // Calculate overall confidence
  const totalChecks = validation.issues.length + validation.suggestions.length + validation.corrected.length;
  const criticalIssues = validation.issues.filter(issue => issue.severity === 'high').length;
  validation.confidence = totalChecks > 0 ? Math.max(0, (totalChecks - criticalIssues) / totalChecks) : 1;

  return {
    data: sheets,
    validation
  };
};

/**
 * Validate and correct headers
 * @param {Array} headers - Raw headers from Excel
 * @param {string} sheetName - Sheet name for context
 * @returns {Object} - Validation results with corrected headers
 */
const validateHeaders = (headers, sheetName) => {
  const issues = [];
  const suggestions = [];
  const corrected = [];
  
  // Standard header mappings
  const headerMappings = {
    // Portuguese variations
    'código': 'codigo',
    'codigo': 'codigo',
    'cod': 'codigo',
    'descrição': 'descricao',
    'descricao': 'descricao',
    'desc': 'descricao',
    'secção': 'secao',
    'secao': 'secao',
    'seção': 'secao',
    'quantidade': 'quantidade',
    'qtd': 'quantidade',
    'qty': 'quantidade',
    'cliente': 'cliente',
    'client': 'cliente',
    'data': 'data',
    'date': 'data',
    'status': 'status',
    'estado': 'status',
    'prioridade': 'prioridade',
    'priority': 'prioridade',
    'tipo': 'tipo',
    'type': 'tipo',
    
    // Stock specific
    'stock': 'stock',
    'estoque': 'stock',
    'disponivel': 'disponivel',
    'available': 'disponivel',
    
    // Transit specific
    'transito': 'transito',
    'transit': 'transito',
    'fornecedor': 'fornecedor',
    'supplier': 'fornecedor',
    'previsao': 'previsao',
    'eta': 'previsao'
  };

  const correctedHeaders = headers.map((header, index) => {
    if (!header || header.trim() === '') {
      issues.push({
        type: 'empty_header',
        sheet: sheetName,
        column: index + 1,
        severity: 'medium',
        message: `Coluna ${index + 1} sem cabeçalho`
      });
      return `coluna_${index + 1}`;
    }

    const normalized = header.toString().toLowerCase().trim();
    const mapped = headerMappings[normalized];

    if (mapped && mapped !== normalized) {
      corrected.push({
        type: 'header_corrected',
        sheet: sheetName,
        column: index + 1,
        original: header,
        corrected: mapped,
        message: `Cabeçalho '${header}' corrigido para '${mapped}'`
      });
      return mapped;
    }

    if (!mapped) {
      // Check for similar headers
      const similar = findSimilarHeader(normalized, Object.keys(headerMappings));
      if (similar) {
        suggestions.push({
          type: 'header_suggestion',
          sheet: sheetName,
          column: index + 1,
          original: header,
          suggested: headerMappings[similar],
          similarity: calculateSimilarity(normalized, similar),
          message: `Cabeçalho '${header}' pode ser '${headerMappings[similar]}'?`
        });
      }
    }

    return mapped || normalized;
  });

  return {
    issues,
    suggestions,
    corrected,
    correctedHeaders
  };
};

/**
 * Process individual cell value with validation
 * @param {any} value - Raw cell value
 * @param {string} header - Column header
 * @param {string} sheetName - Sheet name
 * @param {number} row - Row number
 * @param {Object} validation - Validation object to update
 * @returns {any} - Processed value
 */
const processValue = (value, header, sheetName, row, validation) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Date processing
  if (header === 'data' || header === 'previsao') {
    const dateValue = parseDate(value);
    if (!dateValue) {
      validation.issues.push({
        type: 'invalid_date',
        sheet: sheetName,
        row,
        column: header,
        value,
        severity: 'medium',
        message: `Data inválida: ${value}`
      });
      return null;
    }
    return dateValue;
  }

  // Number processing
  if (header === 'quantidade' || header === 'stock' || header === 'disponivel') {
    const numValue = parseNumber(value);
    if (numValue === null) {
      validation.issues.push({
        type: 'invalid_number',
        sheet: sheetName,
        row,
        column: header,
        value,
        severity: 'low',
        message: `Número inválido: ${value}`
      });
      return 0;
    }
    return numValue;
  }

  // String processing
  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
};

/**
 * Parse date from various formats
 * @param {any} value - Date value to parse
 * @returns {string|null} - ISO date string or null
 */
const parseDate = (value) => {
  if (!value) return null;

  // Excel date number
  if (typeof value === 'number') {
    const excelDate = XLSX.SSF.parse_date_code(value);
    if (excelDate) {
      return new Date(excelDate.y, excelDate.m - 1, excelDate.d).toISOString().split('T')[0];
    }
  }

  // String date
  if (typeof value === 'string') {
    // Try common Portuguese date formats
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // dd/mm/yyyy
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // dd-mm-yyyy
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // yyyy-mm-dd
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/ // yyyy/mm/dd
    ];

    for (const format of formats) {
      const match = value.match(format);
      if (match) {
        let year, month, day;
        
        if (format.source.startsWith('^(\\d{4})')) {
          // Year first
          [, year, month, day] = match;
        } else {
          // Day first
          [, day, month, year] = match;
        }

        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
    }

    // Try native parsing as last resort
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  return null;
};

/**
 * Parse number from various formats
 * @param {any} value - Number value to parse
 * @returns {number|null} - Parsed number or null
 */
const parseNumber = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    // Remove common formatting
    const cleaned = value.replace(/[^\d.,\-]/g, '');
    
    // Handle Portuguese number format (1.234,56)
    if (cleaned.includes(',') && cleaned.includes('.')) {
      const lastComma = cleaned.lastIndexOf(',');
      const lastDot = cleaned.lastIndexOf('.');
      
      if (lastComma > lastDot) {
        // Portuguese format
        const num = parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
        return isNaN(num) ? null : num;
      }
    }

    // Handle comma as decimal separator
    if (cleaned.includes(',') && !cleaned.includes('.')) {
      const num = parseFloat(cleaned.replace(',', '.'));
      return isNaN(num) ? null : num;
    }

    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  return null;
};

/**
 * Validate data consistency across rows
 * @param {Array} data - Processed data
 * @param {string} sheetName - Sheet name
 * @param {Object} validation - Validation object to update
 */
const validateDataConsistency = (data, sheetName, validation) => {
  if (data.length === 0) return;

  // Check for duplicate codes
  const codes = data.map(row => row.codigo).filter(Boolean);
  const duplicates = codes.filter((code, index) => codes.indexOf(code) !== index);
  
  if (duplicates.length > 0) {
    validation.issues.push({
      type: 'duplicate_codes',
      sheet: sheetName,
      severity: 'medium',
      values: [...new Set(duplicates)],
      message: `Códigos duplicados encontrados: ${[...new Set(duplicates)].join(', ')}`
    });
  }

  // Check date consistency
  const dates = data.map(row => row.data).filter(Boolean);
  if (dates.length > 0) {
    const sortedDates = dates.sort();
    const dateRange = {
      min: sortedDates[0],
      max: sortedDates[sortedDates.length - 1]
    };

    // Check for future dates
    const today = new Date().toISOString().split('T')[0];
    const futureDates = dates.filter(date => date > today);
    
    if (futureDates.length > 0) {
      validation.suggestions.push({
        type: 'future_dates',
        sheet: sheetName,
        count: futureDates.length,
        message: `${futureDates.length} datas futuras encontradas - verificar se está correto`
      });
    }
  }

  // Check required fields
  const requiredFields = ['codigo', 'descricao'];
  requiredFields.forEach(field => {
    const missing = data.filter(row => !row[field]).length;
    if (missing > 0) {
      validation.issues.push({
        type: 'missing_required',
        sheet: sheetName,
        field,
        count: missing,
        severity: 'high',
        message: `${missing} linhas sem ${field} obrigatório`
      });
    }
  });
};

/**
 * Find similar header using string similarity
 * @param {string} target - Target header
 * @param {Array} options - Available options
 * @returns {string|null} - Most similar option
 */
const findSimilarHeader = (target, options) => {
  let bestMatch = null;
  let bestScore = 0;

  for (const option of options) {
    const score = calculateSimilarity(target, option);
    if (score > bestScore && score > 0.6) {
      bestScore = score;
      bestMatch = option;
    }
  }

  return bestMatch;
};

/**
 * Calculate string similarity using Levenshtein distance
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} - Similarity score (0-1)
 */
const calculateSimilarity = (a, b) => {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLength = Math.max(a.length, b.length);
  return (maxLength - matrix[b.length][a.length]) / maxLength;
};

/**
 * Merge imported data from multiple sources
 * @param {Array} results - Array of import results
 * @returns {Object} - Merged data
 */
const mergeImportedData = (results) => {
  const merged = {};

  results.forEach(result => {
    Object.entries(result.data).forEach(([sheetName, data]) => {
      if (!merged[sheetName]) {
        merged[sheetName] = [];
      }
      merged[sheetName].push(...data);
    });
  });

  // Remove duplicates based on codigo
  Object.keys(merged).forEach(sheetName => {
    const seen = new Set();
    merged[sheetName] = merged[sheetName].filter(item => {
      const key = `${item.codigo}_${item.data}_${item.secao}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  });

  return merged;
};

/**
 * Setup file polling for automatic updates
 * @param {string} url - File URL to poll
 * @param {Function} callback - Callback when file changes
 * @param {string} lastModified - Last known modification date
 */
const setupFilePolling = (url, callback, lastModified) => {
  const pollInterval = 60000; // 1 minute
  let currentLastModified = lastModified;

  const poll = async () => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const newLastModified = response.headers.get('last-modified');

      if (newLastModified && newLastModified !== currentLastModified) {
        currentLastModified = newLastModified;
        const updateResult = await importFromURL(url);
        callback(updateResult);
      }
    } catch (error) {
      console.warn('File polling error:', error);
    }
  };

  const intervalId = setInterval(poll, pollInterval);

  // Return cleanup function
  return () => clearInterval(intervalId);
};

/**
 * Calculate week from date (utility function for this module)
 * @param {string} dateString - Date string
 * @returns {string} - Week string
 */
const calculateWeekFromDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const weekOfMonth = Math.ceil(dayOfMonth / 7);
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${weekOfMonth}ª Semana de ${monthName}/${year}`;
};
