'use client';

import { type Session } from 'next-auth';
import { createContext, useContext, type FC, type PropsWithChildren } from 'react';

interface AuthContextType {
  user: Session['user'];
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthContextProviderProps extends PropsWithChildren {
  user: Session['user'];
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({ children, user }) => {
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
