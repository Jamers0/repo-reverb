import React from 'react';
import { Download, FileText, Table } from 'lucide-react';
import Button from '../ui/Button';
import * as XLSX from 'xlsx';

const ExportTools = ({ data, filename = 'rupturas_stock' }) => {
  
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    // Preparar dados para Excel
    const excelData = data.map(item => ({
      'Secção': item.secao,
      'Cliente': item.clienteNome,
      'Nº Documento': item.documento,
      'Nº Produto': item.codigo,
      'Descrição do Produto': item.descricao,
      'Quantidade Planejada': item.quantidadePlanejada,
      'Unidade de Medida': item.unidade,
      'Data de Envio': item.dataEnvio,
      'Stock CT': item.stockCT,
      'Stock FF': item.stockFF,
      'TR (Trânsito)': item.transito,
      'Total Disponível': item.totalDisponivel,
      'Quantidade em Ruptura': item.quantidadeRuptura,
      'Tipo de Ruptura': item.tipoRuptura === 'total' ? 'Total' : 'Parcial',
      'Comentários': item.comentarios,
      'Status': item.acaoTomada,
      'Data da Análise': item.dataAnalise ? new Date(item.dataAnalise).toLocaleString('pt-PT') : '',
      'Operador': item.operador
    }));

    // Criar workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Configurar larguras das colunas
    const colWidths = [
      { wch: 8 },   // Secção
      { wch: 20 },  // Cliente
      { wch: 12 },  // Documento
      { wch: 12 },  // Produto
      { wch: 30 },  // Descrição
      { wch: 12 },  // Quantidade
      { wch: 8 },   // Unidade
      { wch: 12 },  // Data
      { wch: 10 },  // Stock CT
      { wch: 10 },  // Stock FF
      { wch: 10 },  // Trânsito
      { wch: 12 },  // Total Disp
      { wch: 12 },  // Ruptura
      { wch: 12 },  // Tipo
      { wch: 25 },  // Comentários
      { wch: 15 },  // Status
      { wch: 18 },  // Data Análise
      { wch: 15 }   // Operador
    ];
    ws['!cols'] = colWidths;

    // Adicionar cores para rupturas
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const item = data[R - 1];
      if (item && item.tipoRuptura) {
        // Colorir linha baseado no tipo de ruptura
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) continue;
          
          if (item.tipoRuptura === 'total') {
            ws[cellRef].s = {
              fill: { fgColor: { rgb: "FFEBEE" } },
              font: { color: { rgb: "B71C1C" } }
            };
          } else if (item.tipoRuptura === 'parcial') {
            ws[cellRef].s = {
              fill: { fgColor: { rgb: "FFF8E1" } },
              font: { color: { rgb: "E65100" } }
            };
          }
        }
      }
    }

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Rupturas de Stock');

    // Adicionar sheet de resumo
    const summary = [
      ['Resumo da Análise de Rupturas'],
      [''],
      ['Total de Rupturas', data.length],
      ['Rupturas Totais', data.filter(item => item.tipoRuptura === 'total').length],
      ['Rupturas Parciais', data.filter(item => item.tipoRuptura === 'parcial').length],
      ['Clientes Afetados', new Set(data.map(item => item.cliente)).size],
      ['Secções Afetadas', new Set(data.map(item => item.secao)).size],
      [''],
      ['Data da Análise', new Date().toLocaleString('pt-PT')]
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumo');

    // Salvar arquivo
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    // Para implementação completa, usar uma biblioteca como jsPDF
    alert('Exportação PDF será implementada em breve');
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    const csvData = data.map(item => ({
      secao: item.secao,
      cliente: item.clienteNome,
      documento: item.documento,
      codigo: item.codigo,
      descricao: item.descricao,
      quantidade_planejada: item.quantidadePlanejada,
      unidade: item.unidade,
      data_envio: item.dataEnvio,
      stock_ct: item.stockCT,
      stock_ff: item.stockFF,
      transito: item.transito,
      total_disponivel: item.totalDisponivel,
      quantidade_ruptura: item.quantidadeRuptura,
      tipo_ruptura: item.tipoRuptura,
      comentarios: item.comentarios,
      status: item.acaoTomada
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="success"
        size="sm"
        icon={<Table className="w-4 h-4" />}
        onClick={exportToExcel}
        disabled={!data || data.length === 0}
      >
        Excel (.xlsx)
      </Button>
      
      <Button 
        variant="danger"
        size="sm"
        icon={<FileText className="w-4 h-4" />}
        onClick={exportToPDF}
        disabled={!data || data.length === 0}
      >
        PDF
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        icon={<Download className="w-4 h-4" />}
        onClick={exportToCSV}
        disabled={!data || data.length === 0}
      >
        CSV
      </Button>
    </div>
  );
};

export default ExportTools;