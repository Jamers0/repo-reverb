import React, { useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const FileUploadSection = ({ onFilesUploaded }) => {
  const [uploadedFiles, setUploadedFiles] = useState({
    pedidos: null,
    stockCT: null,
    stockFF: null,
    transito: ''
  });

  const handleFileUpload = (type, file) => {
    const newFiles = { ...uploadedFiles, [type]: file };
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  const handleRemoveFile = (type) => {
    const newFiles = { ...uploadedFiles, [type]: type === 'transito' ? '' : null };
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  const FileUploadCard = ({ title, description, type, accept, required = false }) => (
    <Card className="p-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            {title}
            {required && <span className="text-red-500">*</span>}
          </h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        
        {uploadedFiles[type] ? (
          <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                {uploadedFiles[type].name || 'Arquivo carregado'}
              </span>
            </div>
            <button
              onClick={() => handleRemoveFile(type)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept={accept}
              onChange={(e) => e.target.files[0] && handleFileUpload(type, e.target.files[0])}
              className="hidden"
              id={`upload-${type}`}
            />
            <label
              htmlFor={`upload-${type}`}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Clique para fazer upload</p>
                <p className="text-xs text-gray-400">ou arraste o arquivo aqui</p>
              </div>
            </label>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload de Arquivos</h2>
        <p className="text-sm text-gray-600">
          Carregue os arquivos necessários para análise de rupturas. Os campos marcados com * são obrigatórios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FileUploadCard
          title="Pedidos"
          description="Arquivo principal com pedidos/necessidades"
          type="pedidos"
          accept=".xlsx,.xls,.csv"
          required
        />
        
        <FileUploadCard
          title="Stock CT (Principal)"
          description="Estoque do armazém principal"
          type="stockCT"
          accept=".xlsx,.xls,.csv"
          required
        />
        
        <FileUploadCard
          title="Stock FF (Secundário)"
          description="Estoque do armazém secundário"
          type="stockFF"
          accept=".xlsx,.xls,.csv"
        />
        
        <Card className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Produtos em Trânsito</h3>
              <p className="text-xs text-gray-500">Dados de produtos em movimento</p>
            </div>
            
            <textarea
              value={uploadedFiles.transito}
              onChange={(e) => handleFileUpload('transito', e.target.value)}
              placeholder="Cole aqui os dados de trânsito ou faça upload de arquivo..."
              className="w-full h-20 p-2 text-sm border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {uploadedFiles.transito && (
              <button
                onClick={() => handleRemoveFile('transito')}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Limpar dados
              </button>
            )}
          </div>
        </Card>
      </div>
      
      {(uploadedFiles.pedidos && uploadedFiles.stockCT) && (
        <div className="flex justify-center">
          <Button 
            size="lg"
            className="px-8"
            onClick={() => {
              // Trigger analysis
              window.dispatchEvent(new CustomEvent('startRuptureAnalysis'));
            }}
          >
            Iniciar Análise de Rupturas
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;