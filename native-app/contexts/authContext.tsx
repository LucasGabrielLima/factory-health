import React from 'react';
import { useStorageState } from './useStorageState';
import axios from 'axios';
import { BASE_URL } from '../config';

const AuthContext = React.createContext<{ signIn: (username: string, password: string) => Promise<boolean>; signUp: (username: string, password: string) => Promise<boolean>; signOut: () => void; session?: string | null, isLoading: boolean } | null>(null);

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (username, password) => {
          try {
            const res = await axios.post(`${BASE_URL}/user/login`, {
              username,
              password
            })

            const updateSession = async () => {
              setSession(res.data.accessToken);
            };

            await updateSession()
            return true
          }
          catch (e) {
            if (e.response) {
              console.error(e.response.data.message);
            }
            else {
              console.error(e);
            }
          }
          return false
        },

        signOut: () => {
          setSession(null);
        },

        signUp: async (username, password) => {
          try {
            const res = await axios.post(`${BASE_URL}/user/register`, {
              username,
              password
            })

            const updateSession = async () => {
              setSession(res.data.accessToken);
            };

            await updateSession()
            return true
          }
          catch (e) {
            if (e.response) {
              console.error(e.response.data.message);
            }
            else {
              console.error(e);
            }
          }
          return false
        },
        session,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
