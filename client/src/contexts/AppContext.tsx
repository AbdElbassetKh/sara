import React, { createContext, useContext, useState } from 'react';

export interface ChildProfile {
  id: number;
  name: string;
  birthDate: string;
  gender: 'boy' | 'girl';
  allergies: string[];
  photoUrl?: string;
}

interface AppContextType {
  selectedChild: ChildProfile | null;
  setSelectedChild: (child: ChildProfile | null) => void;
  children: ChildProfile[];
  setChildren: (children: ChildProfile[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);

  return (
    <AppContext.Provider
      value={{
        selectedChild,
        setSelectedChild,
        children: childrenList,
        setChildren: setChildrenList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
