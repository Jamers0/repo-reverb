# Instruções de Instalação - Sistema de Gestão Logística

## ⚠️ Pré-requisitos Obrigatórios

Este projeto requer **Node.js** para funcionar. Siga os passos abaixo para configurar o ambiente:

### 1. Instalar Node.js

1. Acesse [https://nodejs.org/](https://nodejs.org/)
2. Baixe a versão **LTS** (recomendada para produção)
3. Execute o instalador e siga as instruções
4. Reinicie o VS Code após a instalação

### 2. Verificar Instalação

Abra um terminal no VS Code e execute:

```bash
node --version
npm --version
```

Você deve ver as versões instaladas do Node.js e npm.

### 3. Instalar Dependências do Projeto

No terminal do VS Code, navegue até a pasta do projeto e execute:

```bash
npm install
```

### 4. Executar a Aplicação

Após a instalação das dependências:

```bash
npm run dev
```

A aplicação será aberta em [http://localhost:5173](http://localhost:5173)

## 🚀 Início Rápido (Após instalar Node.js)

```bash
# 1. Instalar dependências
npm install

# 2. Executar em modo desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:5173
```

## 📦 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Visualizar build de produção

## 🔧 Resolução de Problemas

### Erro: 'npm' is not recognized

**Causa**: Node.js não está instalado ou não está no PATH do sistema.

**Solução**: 
1. Instale o Node.js do site oficial
2. Reinicie o VS Code
3. Teste com `node --version`

### Erro: Cannot find module

**Causa**: Dependências não foram instaladas.

**Solução**: Execute `npm install`

### Porta 5173 em uso

**Causa**: Outra aplicação está usando a porta.

**Solução**: O Vite automaticamente encontrará uma porta disponível (5174, 5175, etc.)

## 📞 Suporte

Se você encontrar problemas durante a instalação:

1. Verifique se o Node.js está instalado corretamente
2. Certifique-se de estar na pasta correta do projeto
3. Tente executar os comandos como administrador se necessário
4. Consulte a documentação oficial do Node.js
