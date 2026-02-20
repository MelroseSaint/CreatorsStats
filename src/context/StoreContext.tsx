import React, { createContext, useContext, useEffect, useState } from 'react';
import { type AppState, INITIAL_STATE, type MetricEntry, type Project, type UserProfile } from '../types';
import { generateId } from '../utils';

interface StoreContextType {
  state: AppState;
  updateUser: (updates: Partial<UserProfile>) => void;
  addMetric: (metric: Omit<MetricEntry, 'id'>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  deleteMetric: (id: string) => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  resetData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const stored = localStorage.getItem('growthledger_v1_store');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Simple migration check could go here
        return { ...INITIAL_STATE, ...parsed };
      } catch (e) {
        console.error('Failed to parse storage', e);
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  // Auto-save effect
  useEffect(() => {
    localStorage.setItem('growthledger_v1_store', JSON.stringify(state));
  }, [state]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...updates },
      meta: { ...prev.meta, lastSaved: Date.now() }
    }));
  };

  const addMetric = (metric: Omit<MetricEntry, 'id'>) => {
    setState(prev => ({
      ...prev,
      metrics: [...prev.metrics, { ...metric, id: generateId() }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      meta: { ...prev.meta, lastSaved: Date.now() }
    }));
  };

  const deleteMetric = (id: string) => {
    setState(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m.id !== id),
      meta: { ...prev.meta, lastSaved: Date.now() }
    }));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: generateId() }],
      meta: { ...prev.meta, lastSaved: Date.now() }
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p),
      meta: { ...prev.meta, lastSaved: Date.now() }
    }));
  };

  const deleteProject = (id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      meta: { ...prev.meta, lastSaved: Date.now() }
    }));
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `growthledger_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importData = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          // Basic validation
          if (!parsed.meta || !parsed.user) throw new Error("Invalid backup file");
          setState(parsed);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const resetData = () => {
    if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      setState(INITIAL_STATE);
    }
  };

  return (
    <StoreContext.Provider value={{
      state,
      updateUser,
      addMetric,
      deleteMetric,
      addProject,
      updateProject,
      deleteProject,
      exportData,
      importData,
      resetData
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
