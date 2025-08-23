import React from 'react';

const MinimalTest = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#0078D4', fontSize: '24px', marginBottom: '16px' }}>
        🚀 Sistema de Gestão de Transferências
      </h1>
      
      <div style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Status do Sistema</h2>
        <p style={{ margin: 0, color: '#007700' }}>✅ Página carregando corretamente</p>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ fontSize: '16px', marginTop: 0 }}>Nova Ordem de Transferência - NOT001</h3>
        <p>Se você está vendo esta mensagem, o roteamento e o React estão funcionando.</p>
        
        <div style={{ marginTop: '16px' }}>
          <button 
            style={{ 
              backgroundColor: '#0078D4', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          >
            + Nova Ordem
          </button>
          
          <button 
            style={{ 
              backgroundColor: '#fff', 
              color: '#0078D4', 
              border: '1px solid #0078D4', 
              padding: '8px 16px', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => console.log('Teste de console')}
          >
            Teste Console
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Timestamp: {new Date().toLocaleString()}</p>
        <p>URL: {window.location.href}</p>
      </div>
    </div>
  );
};

export default MinimalTest;
