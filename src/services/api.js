import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      return { success: true, data: { token, user } };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro de login' };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// Serviços de materiais
export const materialService = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/materials', { params: filters });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar materiais' };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/materials/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar material' };
    }
  },

  search: async (query, filters = {}) => {
    try {
      const response = await api.get('/materials/search', { 
        params: { q: query, ...filters } 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro na pesquisa' };
    }
  }
};

// Serviços de requisições
export const requisitionService = {
  create: async (requisitionData) => {
    try {
      const response = await api.post('/requisitions', requisitionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao criar requisição' };
    }
  },

  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/requisitions', { params: filters });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar requisições' };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/requisitions/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar requisição' };
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/requisitions/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao atualizar requisição' };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/requisitions/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao deletar requisição' };
    }
  }
};

// Serviços de relatórios
export const reportService = {
  generate: async (reportType, filters = {}) => {
    try {
      const response = await api.post('/reports/generate', { 
        type: reportType, 
        filters 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao gerar relatório' };
    }
  },

  export: async (reportId, format = 'excel') => {
    try {
      const response = await api.get(`/reports/${reportId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Criar URL para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${reportId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao exportar relatório' };
    }
  }
};

// Serviços de configuração/metadados
export const configService = {
  getClients: async () => {
    try {
      const response = await api.get('/config/clients');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar clientes' };
    }
  },

  getClasses: async () => {
    try {
      const response = await api.get('/config/classes');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar classes' };
    }
  },

  getUnits: async () => {
    try {
      const response = await api.get('/config/units');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar unidades' };
    }
  },

  getWarehouses: async () => {
    try {
      const response = await api.get('/config/warehouses');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar depósitos' };
    }
  },

  getReasons: async () => {
    try {
      const response = await api.get('/config/reasons');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erro ao buscar motivos' };
    }
  }
};

// Mock data para desenvolvimento local (remover em produção)
export const mockData = {
  materials: [
    { value: 'CFBA0001', label: 'CFBA0001 - Banana 4/6', stock: 150, unit: 'KG' },
    { value: 'CFBA0002', label: 'CFBA0002 - Maçã Golden', stock: 85, unit: 'KG' },
    { value: 'CFBA0003', label: 'CFBA0003 - Laranja Valencia', stock: 230, unit: 'KG' },
    { value: 'CFBA0004', label: 'CFBA0004 - Pêra Rocha', stock: 67, unit: 'KG' },
  ],
  clients: [
    { value: '0000000001', label: '0000000001 - Supplier Principal' },
    { value: '0000000002', label: '0000000002 - Fornecedor Secundário' },
    { value: '0000000003', label: '0000000003 - Distribuidor Local' },
  ],
  classes: [
    { value: 'Y', label: 'Y - Classe Y' },
    { value: 'X', label: 'X - Classe X' },
    { value: 'Z', label: 'Z - Classe Z' },
  ],
  units: [
    { value: 'KG', label: 'KG - Quilograma' },
    { value: 'UN', label: 'UN - Unidade' },
    { value: 'LT', label: 'LT - Litro' },
    { value: 'CX', label: 'CX - Caixa' },
  ],
  warehouses: [
    { value: 'DEP001', label: 'DEP001 - Depósito Principal' },
    { value: 'DEP002', label: 'DEP002 - Depósito Secundário' },
    { value: 'DEP003', label: 'DEP003 - Depósito Refrigerado' },
  ],
  reasons: [
    { value: '000000000000588696', label: 'Reposição de Stock' },
    { value: '000000000000588697', label: 'Pedido Especial' },
    { value: '000000000000588698', label: 'Urgência Operacional' },
    { value: '000000000000588699', label: 'Manutenção Preventiva' },
  ]
};

export default api;
