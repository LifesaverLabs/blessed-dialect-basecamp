import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DialectMode = 'blessed' | 'american';

interface DialectContextType {
  dialectMode: DialectMode;
  setDialectMode: (mode: DialectMode) => void;
  toggleDialectMode: () => void;
}

const DialectContext = createContext<DialectContextType | undefined>(undefined);

const STORAGE_KEY = 'blessed-dialect-mode';

export function DialectProvider({ children }: { children: ReactNode }) {
  const [dialectMode, setDialectModeState] = useState<DialectMode>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'blessed' || stored === 'american') {
        return stored;
      }
    }
    return 'blessed'; // Default to Blesséd Dialekt
  });

  // Persist to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, dialectMode);
  }, [dialectMode]);

  const setDialectMode = (mode: DialectMode) => {
    setDialectModeState(mode);
  };

  const toggleDialectMode = () => {
    setDialectModeState(prev => prev === 'blessed' ? 'american' : 'blessed');
  };

  return (
    <DialectContext.Provider value={{ dialectMode, setDialectMode, toggleDialectMode }}>
      {children}
    </DialectContext.Provider>
  );
}

export function useDialect() {
  const context = useContext(DialectContext);
  if (context === undefined) {
    throw new Error('useDialect must be used within a DialectProvider');
  }
  return context;
}

/**
 * Helper hook to get the appropriate definition based on dialect mode
 */
export function useDefinition(entry: {
  definitionStandard?: string;
  definitionDialect?: string;
  definition?: string;
}) {
  const { dialectMode } = useDialect();

  if (dialectMode === 'blessed') {
    return entry.definitionDialect || entry.definitionStandard || entry.definition || '';
  } else {
    return entry.definitionStandard || entry.definitionDialect || entry.definition || '';
  }
}
