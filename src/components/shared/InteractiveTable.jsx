import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Check, 
  X, 
  Download, 
  Eye,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const InteractiveTable = ({ 
  data = [], 
  columns = [],
  onRowClick,
  onRowEdit,
  onRowSelect,
  onBulkAction,
  enableSelection = true,
  enableInlineEdit = true,
  enableGrouping = true,
  enableSorting = true,
  pageSize = 20,
  className = ""
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [groupBy, setGroupBy] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [columnFilters, setColumnFilters] = useState({});
  const [columnWidths, setColumnWidths] = useState({});

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });

    return sortConfig.direction === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortConfig]);

  // Filtering logic
  const filteredData = useMemo(() => {
    if (Object.keys(columnFilters).length === 0) return sortedData;

    return sortedData.filter(row => {
      return Object.entries(columnFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        
        const cellValue = row[key];
        if (cellValue === null || cellValue === undefined) return false;

        const cellStr = cellValue.toString().toLowerCase();
        const filterStr = filterValue.toLowerCase();

        return cellStr.includes(filterStr);
      });
    });
  }, [sortedData, columnFilters]);

  // Grouping logic
  const groupedData = useMemo(() => {
    if (!groupBy) return { '': filteredData };

    const groups = {};
    filteredData.forEach(row => {
      const groupValue = row[groupBy] || 'Sem Classificação';
      if (!groups[groupValue]) {
        groups[groupValue] = [];
      }
      groups[groupValue].push(row);
    });

    return groups;
  }, [filteredData, groupBy]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!groupBy) {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return { '': filteredData.slice(start, end) };
    }

    const paginatedGroups = {};
    Object.entries(groupedData).forEach(([group, rows]) => {
      if (expandedGroups.has(group) || !groupBy) {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        paginatedGroups[group] = rows.slice(start, end);
      } else {
        paginatedGroups[group] = [];
      }
    });

    return paginatedGroups;
  }, [groupedData, currentPage, pageSize, expandedGroups, groupBy]);

  // Handle sorting
  const handleSort = (key) => {
    if (!enableSorting) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle row selection
  const handleRowSelect = (rowId, selected) => {
    if (!enableSelection) return;

    const newSelected = new Set(selectedRows);
    if (selected) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
    
    if (onRowSelect) {
      onRowSelect(Array.from(newSelected));
    }
  };

  // Handle select all
  const handleSelectAll = (selected) => {
    if (!enableSelection) return;

    if (selected) {
      const allIds = new Set(filteredData.map(row => row.id));
      setSelectedRows(allIds);
      if (onRowSelect) {
        onRowSelect(Array.from(allIds));
      }
    } else {
      setSelectedRows(new Set());
      if (onRowSelect) {
        onRowSelect([]);
      }
    }
  };

  // Handle inline editing
  const handleCellEdit = (rowId, columnKey, value) => {
    if (!enableInlineEdit) return;

    setEditingCell({ rowId, columnKey });
    setEditValue(value || '');
  };

  const handleEditSave = () => {
    if (editingCell && onRowEdit) {
      onRowEdit(editingCell.rowId, editingCell.columnKey, editValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Handle grouping
  const toggleGroup = (groupValue) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupValue)) {
      newExpanded.delete(groupValue);
    } else {
      newExpanded.add(groupValue);
    }
    setExpandedGroups(newExpanded);
  };

  // Handle column filtering
  const handleColumnFilter = (columnKey, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (!enableSorting) return null;
    
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-pw-green" />
      : <ArrowDown className="w-4 h-4 text-pw-green" />;
  };

  // Render cell content
  const renderCell = (row, column) => {
    const value = row[column.key];
    const isEditing = editingCell?.rowId === row.id && editingCell?.columnKey === column.key;

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSave();
              if (e.key === 'Escape') handleEditCancel();
            }}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEditSave}
            className="p-1 h-6 w-6"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEditCancel}
            className="p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      );
    }

    // Custom cell rendering
    if (column.render) {
      return column.render(value, row);
    }

    // Default cell rendering with type-specific formatting
    let displayValue = value;
    
    if (column.type === 'date' && value) {
      displayValue = new Date(value).toLocaleDateString('pt-PT');
    } else if (column.type === 'number' && value !== null && value !== undefined) {
      displayValue = typeof value === 'number' ? value.toLocaleString('pt-PT') : value;
    } else if (column.type === 'currency' && value !== null && value !== undefined) {
      displayValue = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    } else if (column.type === 'percentage' && value !== null && value !== undefined) {
      displayValue = `${(value * 100).toFixed(1)}%`;
    }

    return (
      <div 
        className={`${enableInlineEdit && column.editable ? 'cursor-pointer hover:bg-gray-50 px-1 py-1 rounded' : ''}`}
        onClick={() => enableInlineEdit && column.editable && handleCellEdit(row.id, column.key, value)}
      >
        {displayValue}
        {enableInlineEdit && column.editable && (
          <Edit className="w-3 h-3 text-gray-400 inline ml-1 opacity-0 group-hover:opacity-100" />
        )}
      </div>
    );
  };

  // Get grouping options
  const groupingOptions = [
    { value: '', label: 'Sem Agrupamento' },
    ...columns
      .filter(col => col.groupable !== false)
      .map(col => ({ value: col.key, label: col.title }))
  ];

  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const isAllSelected = selectedRows.size === filteredData.length && filteredData.length > 0;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < filteredData.length;

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Table Controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {enableGrouping && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Agrupar por:
                </label>
                <Select
                  value={groupBy}
                  onChange={setGroupBy}
                  options={groupingOptions}
                  className="min-w-[150px]"
                />
              </div>
            )}
            
            {selectedRows.size > 0 && onBulkAction && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedRows.size} selecionado(s)
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkAction('export', Array.from(selectedRows))}
                  className="flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Exportar
                </Button>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            {totalRows} registro(s) encontrado(s)
          </div>
        </div>

        {/* Column Filters */}
        <div className="grid grid-cols-auto gap-2">
          {columns.filter(col => col.filterable !== false).map(column => (
            <div key={`filter-${column.key}`} className="min-w-[120px]">
              <Input
                placeholder={`Filtrar ${column.title}...`}
                value={columnFilters[column.key] || ''}
                onChange={(e) => handleColumnFilter(column.key, e.target.value)}
                size="sm"
                className="text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {enableSelection && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    enableSorting && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  style={{ width: columnWidths[column.key] || column.width }}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {renderSortIcon(column.key)}
                    {column.filterable !== false && (
                      <Filter className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
              
              <th className="px-4 py-3 text-left">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(paginatedData).map(([groupValue, rows]) => (
              <React.Fragment key={groupValue}>
                {/* Group Header */}
                {groupBy && groupValue && (
                  <tr className="bg-gray-100">
                    <td colSpan={columns.length + (enableSelection ? 1 : 0) + 1} className="px-4 py-2">
                      <button
                        onClick={() => toggleGroup(groupValue)}
                        className="flex items-center gap-2 font-medium text-gray-700 hover:text-gray-900"
                      >
                        {expandedGroups.has(groupValue) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                        {groupValue} ({groupedData[groupValue]?.length || 0} itens)
                      </button>
                    </td>
                  </tr>
                )}
                
                {/* Group Rows */}
                {(!groupBy || expandedGroups.has(groupValue) || !groupValue) && rows.map(row => (
                  <tr 
                    key={row.id}
                    className={`group hover:bg-gray-50 ${selectedRows.has(row.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {enableSelection && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(row.id)}
                          onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    
                    {columns.map(column => (
                      <td 
                        key={`${row.id}-${column.key}`}
                        className="px-4 py-3 text-sm text-gray-900"
                        style={{ width: columnWidths[column.key] || column.width }}
                      >
                        {renderCell(row, column)}
                      </td>
                    ))}
                    
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick && onRowClick(row);
                          }}
                          className="p-1 h-6 w-6"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        
                        {enableInlineEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Open edit modal or inline edit
                            }}
                            className="p-1 h-6 w-6"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, totalRows)} de {totalRows} resultados
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="text-gray-500">...</span>
                  <Button
                    variant={currentPage === totalPages ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 p-0"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTable;
