import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types';

interface AppState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  selectedLanguage: string;
  setLoggedIn: (loggedIn: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  setSelectedLanguage: (lang: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const logout = () => {
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        selectedLanguage,
        setLoggedIn,
        setUser,
        setSelectedLanguage,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
