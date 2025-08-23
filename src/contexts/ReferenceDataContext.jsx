import React, { createContext, useContext } from 'react';
import {
  SECTIONS,
  DEPARTMENTS,
  CLIENTS,
  getSectionByCode,
  getDepartmentByCode,
  getClientByNumber,
  getClientByCode,
  getSectionsByCategory,
  getDepartmentsByMainCategory,
  getClientsWithCode,
  getClientsWithoutCode,
  SECTION_OPTIONS,
  DEPARTMENT_OPTIONS,
  CLIENT_OPTIONS,
  SECTION_CATEGORIES,
  DEPARTMENT_CATEGORIES
} from '../data/referenceData';

const ReferenceDataContext = createContext();

export const useReferenceData = () => {
  const context = useContext(ReferenceDataContext);
  if (!context) {
    throw new Error('useReferenceData must be used within a ReferenceDataProvider');
  }
  return context;
};

export const ReferenceDataProvider = ({ children }) => {
  const value = {
    // Dados brutos
    sections: SECTIONS,
    departments: DEPARTMENTS,
    clients: CLIENTS,
    
    // Funções de busca
    getSectionByCode,
    getDepartmentByCode,
    getClientByNumber,
    getClientByCode,
    getSectionsByCategory,
    getDepartmentsByMainCategory,
    getClientsWithCode,
    getClientsWithoutCode,
    
    // Arrays formatados para dropdowns
    sectionOptions: SECTION_OPTIONS,
    departmentOptions: DEPARTMENT_OPTIONS,
    clientOptions: CLIENT_OPTIONS,
    
    // Categorias
    sectionCategories: SECTION_CATEGORIES,
    departmentCategories: DEPARTMENT_CATEGORIES,
    
    // Funções utilitárias adicionais
    formatSectionForDisplay: (code) => {
      const section = getSectionByCode(code);
      return section ? `${section.code} - ${section.name}` : code;
    },
    
    formatDepartmentForDisplay: (code) => {
      const dept = getDepartmentByCode(code);
      return dept ? `${dept.code} - ${dept.name}` : code;
    },
    
    formatClientForDisplay: (numberOrCode) => {
      // Tenta buscar por número primeiro, depois por código
      let client = getClientByNumber(numberOrCode);
      if (!client) {
        client = getClientByCode(numberOrCode);
      }
      
      if (client) {
        return client.hasCode 
          ? `${client.code} - ${client.name}`
          : `${client.number} - ${client.name}`;
      }
      return numberOrCode;
    },
    
    // Validadores
    isValidSectionCode: (code) => {
      return SECTIONS.hasOwnProperty(code);
    },
    
    isValidDepartmentCode: (code) => {
      return DEPARTMENTS.hasOwnProperty(code);
    },
    
    isValidClientNumber: (number) => {
      return CLIENTS.hasOwnProperty(number);
    },
    
    isValidClientCode: (code) => {
      return Object.values(CLIENTS).some(client => client.code === code);
    },
    
    // Filtros especializados
    getMainAirlines: () => {
      const mainAirlineCodes = ['AC', 'AF', 'AA', 'EK', 'TP', 'DL', 'LH', 'BA', 'S4', 'KE'];
      return Object.values(CLIENTS).filter(client => 
        mainAirlineCodes.includes(client.code)
      );
    },
    
    getProductionSections: () => {
      return getSectionsByCategory('Produção');
    },
    
    getStorageDepartments: () => {
      const storageCategories = ['Congelados', 'PRAÇA', 'Refrigerados', 'Secos'];
      return Object.values(DEPARTMENTS).filter(dept => 
        storageCategories.includes(dept.mainCategory)
      );
    },
    
    getConsumableDepartments: () => {
      return getDepartmentsByMainCategory('Consumíveis');
    }
  };

  return (
    <ReferenceDataContext.Provider value={value}>
      {children}
    </ReferenceDataContext.Provider>
  );
};

export default ReferenceDataContext;
