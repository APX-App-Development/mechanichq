import React, { createContext, useContext, useState, useEffect } from 'react';

const DevModeContext = createContext();

const DEV_SECRET_CODE = 'dev1234'; // Change this to your preferred code

export function DevModeProvider({ children }) {
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('devMode');
    setIsDevMode(stored === 'true');
  }, []);

  const enableDevMode = (code) => {
    if (code === DEV_SECRET_CODE) {
      setIsDevMode(true);
      localStorage.setItem('devMode', 'true');
      return true;
    }
    return false;
  };

  const disableDevMode = () => {
    setIsDevMode(false);
    localStorage.removeItem('devMode');
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, enableDevMode, disableDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDevMode must be used within DevModeProvider');
  }
  return context;
}