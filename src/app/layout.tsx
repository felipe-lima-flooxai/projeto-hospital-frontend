"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { AuthProvider } from '@/context/AuthContext';
import Link from 'next/link';
//layoutzinho básico usando vários componentes prontos de bootstrap

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body >
        <AuthProvider>
          <Navbar bg="success" variant="success" expand="lg">
            <Container>
              <Navbar.Brand href="/" className='text-white'>Voluntariado Hospital</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto" >
                  <Nav.Link as={Link} href="/" className='text-white'>Home</Nav.Link>
                  <Nav.Link as={Link} href="/vagas" className='text-white'>Vagas</Nav.Link>
                  <Nav.Link as={Link} href="/leaderboard" className='text-white'>Leaderboard</Nav.Link>
                  <Nav.Link as={Link} href="/auth/login" className='text-white'>Login</Nav.Link>
                  <Nav.Link as={Link} href="/auth/signup" className='text-white'>Cadastro</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>


          <main className="py-4">
            <Container>
              {children}
            </Container>
          </main>


          <footer className="bg-success text-white text-center py-3 mt-auto">
            <Container>
              <small>&copy; 2025 Voluntariado Hospital. Todos os direitos reservados.</small>
            </Container>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
