// Storage utilities for data persistence

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Load data from localStorage with error handling
 * @param {string} key - Storage key
 * @returns {any|null} - Parsed data or null if not found/error
 */
export const loadFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) return null;
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

/**
 * Clear all application data from localStorage
 */
export const clearAllStorage = () => {
  try {
    const keys = Object.keys(localStorage);
    const appKeys = keys.filter(key => key.startsWith('app') || key.startsWith('kibiona'));
    appKeys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Check localStorage availability and size
 */
export const getStorageInfo = () => {
  try {
    const used = new Blob(Object.values(localStorage)).size;
    const total = 5 * 1024 * 1024; // 5MB typical limit
    
    return {
      used: used,
      total: total,
      available: total - used,
      percentage: (used / total) * 100
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

/**
 * Compress data before storing (for large datasets)
 * @param {any} data - Data to compress
 */
export const compressData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    // Simple compression by removing extra spaces
    return jsonString.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Error compressing data:', error);
    return data;
  }
};

/**
 * Backup data to file
 * @param {string} filename - Backup filename
 * @param {any} data - Data to backup
 */
export const backupToFile = (filename, data) => {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error backing up to file:', error);
    return false;
  }
};

/**
 * Restore data from file
 * @param {File} file - File to restore from
 * @returns {Promise<any>} - Restored data
 */
export const restoreFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid backup file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading backup file'));
    };
    
    reader.readAsText(file);
  });
};
