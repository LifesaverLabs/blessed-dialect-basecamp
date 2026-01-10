import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AgeVerificationContextType {
  isAgeVerified: boolean;
  verifyAge: (birthDate: Date) => boolean;
  resetVerification: () => void;
  showVerificationModal: boolean;
  setShowVerificationModal: (show: boolean) => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

const STORAGE_KEY = 'blessed-age-verified';
const MIN_AGE = 10; // Minimum age for adult content access - aligned with puberty timing and protecting the 7% with early experiences

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function AgeVerificationProvider({ children }: { children: ReactNode }) {
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    }
    return false;
  });

  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isAgeVerified));
  }, [isAgeVerified]);

  const verifyAge = (birthDate: Date): boolean => {
    const age = calculateAge(birthDate);
    const verified = age >= MIN_AGE;
    setIsAgeVerified(verified);
    if (verified) {
      setShowVerificationModal(false);
    }
    return verified;
  };

  const resetVerification = () => {
    setIsAgeVerified(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AgeVerificationContext.Provider
      value={{
        isAgeVerified,
        verifyAge,
        resetVerification,
        showVerificationModal,
        setShowVerificationModal
      }}
    >
      {children}
    </AgeVerificationContext.Provider>
  );
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext);
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
}

export { MIN_AGE };
