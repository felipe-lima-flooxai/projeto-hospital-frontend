"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { AuthProvider } from '@/context/AuthContext';
import Link from 'next/link';
import "./global.css"
import { useAuth } from '@/context/AuthContext';
import NavbarComponent from '@/components/layout/navbarComponent';
//layoutzinho básico usando vários componentes prontos de bootstrap

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AuthProvider>
          <NavbarComponent/>


          <main className="py-4" style={{flex:1}}>
            <Container>
              {children}
            </Container>
          </main>


          <footer className="bg-success text-white text-center py-3">
            <Container>
              <small>&copy; 2025 Voluntariado Hospital. Todos os direitos reservados.</small>
            </Container>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
