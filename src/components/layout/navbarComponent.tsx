'use client'

import Link from 'next/link'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { useAuth } from '@/context/AuthContext'

export default function NavbarComponent() {
  const { user, clearAuthData } = useAuth()

  return (
    <Navbar bg="success" variant="success" expand="lg">
            <Container>
              <Navbar.Brand href="/" className='text-white'>Voluntariado Hospital</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto" >
                  <Nav.Link as={Link} href="/" className='text-white'>Home</Nav.Link>
                  
                  <Nav.Link as={Link} href="/leaderboard" className='text-white'>Leaderboard</Nav.Link>

                  {!user && (
                    <>
                        <Nav.Link as={Link} href="/vagas" className='text-white'>Vagas</Nav.Link>
                        <Nav.Link as={Link} href="/auth/login" className="text-white">Login</Nav.Link>
                        <Nav.Link as={Link} href="/auth/signup" className="text-white">Cadastro</Nav.Link>
                    </>
                    )}

                    {user && !user?.isAdmin && (
                    <>  
                        
                        <Nav.Link as={Link} href="/vagas" className='text-white'>Vagas</Nav.Link>
                        <Nav.Link as={Link} href="/candidaturas" className="text-white">Candidaturas</Nav.Link>
                        <Nav.Link as={Link} href="/profile" className="text-white">Perfil</Nav.Link>
                        <Nav.Link as={Link} href='/auth/login' onClick={clearAuthData} className="btn btn-link text-white text-decoration-none">Logout</Nav.Link>
                    </>
                    )}

                    {user?.isAdmin && (
                    <>
                        <NavDropdown title="Vagas">
                          <NavDropdown.Item as={Link} href="/vagas"> Listar Vagas </NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/vagas/create"> Criar vaga </NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/vagas/closed"> Vagas Fechadas </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} href="/candidaturas/admin-candidaturas" className="text-white">Candidaturas</Nav.Link>
                        <Nav.Link as={Link} href="/users" className="text-white">Usuários</Nav.Link>
                        <Nav.Link as={Link} href="/auth/signup/admin" className="text-white">Cadastrar Admin</Nav.Link>
                        <Nav.Link as={Link} href="/profile" className="text-white">Perfil</Nav.Link>
                        <Nav.Link as={Link} href='/auth/login' onClick={clearAuthData} className="btn btn-link text-white text-decoration-none">Logout</Nav.Link>
                    </>
                    )}
                </Nav>

                
              </Navbar.Collapse>
            </Container>
          </Navbar>
  )
}
