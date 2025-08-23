import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Contexto simplificado
const DataContext = createContext();

// Estado inicial simplificado
const initialState = {
  rupturesData: [],
  filteredData: [],
  loading: false,
  notifications: [],
  predictions: [],
  filters: {
    section: 'all',
    client: 'all',
    status: 'all',
    priority: 'all',
    search: ''
  }
};

// Reducer simplificado
const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RUPTURES_DATA':
      return {
        ...state,
        rupturesData: action.payload,
        filteredData: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
};

// Provider simplificado
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const setRupturesData = (data) => {
    dispatch({ type: 'SET_RUPTURES_DATA', payload: data });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const updateRupture = (id, data) => {
    console.log('Update rupture:', id, data);
  };

  const setPredictions = (predictions) => {
    console.log('Set predictions:', predictions);
  };

  const value = {
    ...state,
    setRupturesData,
    setLoading,
    addNotification,
    removeNotification,
    updateRupture,
    setPredictions
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook para usar o contexto
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
