'use client'
import { createContext, useContext, useState, ReactNode } from 'react';
//vamos lá, preciso comentar pra eu mesmo me organizar
//esses assuntos ainda não tão 100% na minha mente

/*como to usando typescript, preciso definir o tipo de user.
    Porque a resposta do backend e inserção no contexto podem ser de qualquer tipo
    Então aqui eu defino que vai ser DESSE tipo
*/

interface User {
  id: string;
  username: string;
  email: string;
  fullname: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  totalPoints: number | null;
  scolarity: string | null;
  birthDate: string | null;
  cpf: string | null;
  profession: string | null;
  adress: string | null;
  cep: string | null;
}

//mesma coisa, uma interface pro tipo de contexto. Contextos precisam de tipagem em ts.
interface AuthContextType {
  token: string | null;
  user: User | null;
  setAuthData: (token: string, user: User) => void;
  clearAuthData: () => void;
}

//começa como null vai ter tipo quando usuário logar
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const setAuthData = (token: string, user: User) => {
    setToken(token);
    setUser(user);
  };

  const clearAuthData = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
