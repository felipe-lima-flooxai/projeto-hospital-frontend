'use client'
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const token =  getCookie('token') as string
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter()

  const setAuthData = (token: string, user: User) => {
    setCookie("token", token)
    setUser(user);
  };

  const clearAuthData = () => {
    router.push("/")
    deleteCookie("token")
    setUser(null);
  };

  const getCurrentUser = async () => {
    try {
      
      const res = await fetch('http://localhost:3001/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ` ${token}`
        }
      });

      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      console.log('Usuário não autenticado ou erro no /me');
      setUser(null);
    }
  }

  useEffect(()=>{
    console.log("Token ", token)
    console.log("User ", user)
    if(token && !user){
         getCurrentUser()
    }
 
  },
   [user, token])

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
