import React, { useState, createContext } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface User {
  id?: number;
  username?: string;
  phoneNumber: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | undefined,
  login: (userData: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({user: null, token: undefined, login: async () => {} });

function AuthPage({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState();

    const login = async (userData: User) => {
        const userSession = await(await fetch(import.meta.env.PROD ? "https://server-production-3303.up.railway.app/auth/login" : "http://localhost:5000/auth/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })).json();
        setUser(userSession);
        setToken(userSession.access_token);
        const origin = location.state?.from?.pathname || '/';
        navigate(origin);
      }

    return (
      <AuthContext.Provider value={{user, login, token }}>
        {children}
      </AuthContext.Provider>
    )
}

export default AuthPage