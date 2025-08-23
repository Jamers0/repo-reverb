import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const DataContext = createContext();

// Action types
const DATA_ACTIONS = {
  SET_RUPTURES_DATA: 'SET_RUPTURES_DATA',
  SET_FILTERS: 'SET_FILTERS',
  SET_LOADING: 'SET_LOADING',
  UPDATE_RUPTURE: 'UPDATE_RUPTURE',
  SET_SAVED_VIEWS: 'SET_SAVED_VIEWS',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_ML_PREDICTIONS: 'SET_ML_PREDICTIONS',
  SET_EXPORTED_FILES: 'SET_EXPORTED_FILES'
};

// Initial state
const initialState = {
  rupturesData: [],
  filteredData: [],
  loading: false,
  filters: {
    section: 'all',
    ruptureType: 'all',
    client: 'all',
    priority: 'all',
    dateRange: 'all',
    search: '',
    customFilters: {}
  },
  savedViews: [],
  notifications: [],
  mlPredictions: [],
  exportedFiles: [],
  dashboardConfig: {
    layout: 'grid',
    widgets: ['kpis', 'charts', 'table'],
    theme: 'light'
  }
};

// Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case DATA_ACTIONS.SET_RUPTURES_DATA:
      return {
        ...state,
        rupturesData: action.payload,
        filteredData: action.payload
      };

    case DATA_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case DATA_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case DATA_ACTIONS.UPDATE_RUPTURE:
      const updatedData = state.rupturesData.map(item =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );
      return {
        ...state,
        rupturesData: updatedData,
        filteredData: updatedData
      };

    case DATA_ACTIONS.SET_SAVED_VIEWS:
      return {
        ...state,
        savedViews: action.payload
      };

    case DATA_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };

    case DATA_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    case DATA_ACTIONS.SET_ML_PREDICTIONS:
      return {
        ...state,
        mlPredictions: action.payload
      };

    default:
      return state;
  }
};

// Provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage('appData');
    if (savedData) {
      if (savedData.rupturesData) {
        dispatch({ type: DATA_ACTIONS.SET_RUPTURES_DATA, payload: savedData.rupturesData });
      }
      if (savedData.savedViews) {
        dispatch({ type: DATA_ACTIONS.SET_SAVED_VIEWS, payload: savedData.savedViews });
      }
      if (savedData.filters) {
        dispatch({ type: DATA_ACTIONS.SET_FILTERS, payload: savedData.filters });
      }
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    const dataToSave = {
      rupturesData: state.rupturesData,
      savedViews: state.savedViews,
      filters: state.filters
    };
    saveToLocalStorage('appData', dataToSave);
  }, [state.rupturesData, state.savedViews, state.filters]);

  // Actions
  const actions = {
    setRupturesData: (data) => {
      dispatch({ type: DATA_ACTIONS.SET_RUPTURES_DATA, payload: data });
    },

    setFilters: (filters) => {
      dispatch({ type: DATA_ACTIONS.SET_FILTERS, payload: filters });
    },

    setLoading: (loading) => {
      dispatch({ type: DATA_ACTIONS.SET_LOADING, payload: loading });
    },

    updateRupture: (id, updates) => {
      dispatch({ type: DATA_ACTIONS.UPDATE_RUPTURE, payload: { id, updates } });
    },

    saveView: (viewName, config) => {
      const newView = {
        id: Date.now().toString(),
        name: viewName,
        filters: state.filters,
        config,
        createdAt: new Date().toISOString()
      };
      
      const updatedViews = [...state.savedViews, newView];
      dispatch({ type: DATA_ACTIONS.SET_SAVED_VIEWS, payload: updatedViews });
    },

    loadView: (viewId) => {
      const view = state.savedViews.find(v => v.id === viewId);
      if (view) {
        dispatch({ type: DATA_ACTIONS.SET_FILTERS, payload: view.filters });
      }
    },

    addNotification: (notification) => {
      const newNotification = {
        id: Date.now().toString(),
        ...notification,
        timestamp: new Date().toISOString()
      };
      dispatch({ type: DATA_ACTIONS.ADD_NOTIFICATION, payload: newNotification });
    },

    removeNotification: (id) => {
      dispatch({ type: DATA_ACTIONS.REMOVE_NOTIFICATION, payload: id });
    },

    setPredictions: (predictions) => {
      dispatch({ type: DATA_ACTIONS.SET_ML_PREDICTIONS, payload: predictions });
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { DATA_ACTIONS };
