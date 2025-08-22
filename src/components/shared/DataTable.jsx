import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';

const DataTable = ({ columns, data, onUpdateRow }) => {
  const renderCell = (row, column) => {
    const value = row[column.key];
    const handleChange = (e) => onUpdateRow(row.id, column.key, e.target.value);
    
    if (column.render) {
      return column.render(row);
    }
    
    switch (column.type) {
      case 'select':
        return (
          <Select
            value={value}
            onChange={handleChange}
            options={column.options || []}
            className="text-sm"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={handleChange}
            className="text-sm"
          />
        );
      case 'text':
        return (
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            className="text-sm"
          />
        );
      case 'label':
        return (
          <span className="text-sm text-gray-700">{value}</span>
        );
      default:
        return (
          <span className="text-sm text-gray-700">{value}</span>
        );
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.width || ''
                } ${column.hideOnMobile ? 'hidden sm:table-cell' : ''} ${
                  column.hideOnTablet ? 'hidden md:table-cell' : ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td 
                  key={column.key} 
                  className={`px-3 sm:px-6 py-4 whitespace-nowrap ${
                    column.hideOnMobile ? 'hidden sm:table-cell' : ''
                  } ${column.hideOnTablet ? 'hidden md:table-cell' : ''}`}
                >
                  {renderCell(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
