import React, { createContext, useState, ReactNode, useContext } from 'react';

interface WarningContextType {
  isWarningVisible: boolean;
  setIsWarningVisible: (visible: boolean) => void;
}

const WarningContext = createContext<WarningContextType | undefined>(undefined);

export const WarningProvider = ({ children }: { children: ReactNode }) => {
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  return (
    <WarningContext.Provider value={{ isWarningVisible, setIsWarningVisible }}>
      {children}
    </WarningContext.Provider>
  );
};

export const useWarning = () => {
  const context = useContext(WarningContext);
  if (context === undefined) {
    throw new Error('useWarning must be used within a WarningProvider');
  }
  return context;
};
