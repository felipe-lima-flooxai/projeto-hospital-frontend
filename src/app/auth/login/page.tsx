'use client'
import { useAuth } from "@/context/AuthContext";
import {useState} from "react";
import {setCookie} from "cookies-next"
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
//mesma coisa do login, muda mt não

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { setAuthData } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError('Email ou senha incorretos!');
        return;
        }
   
      const { token, user } = await response.json();
      setAuthData(token, user);

      setCookie('token', `${token}`, {
        path: '/',        
        maxAge: (60 * 60 * 24)/3, // 8 horas igual o do backend. Daí ele apaga automaticamente.
      });

      router.push('/vagas');

    } catch (err) {
        //to setando mas ainda nao to fazendo nada com isso
      setError('Algo inesperado aconteceu. Tente novamente mais tarde.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row>
        <Col>
          <Card className="p-4 shadow" style={{ width: '20rem' }}>
            <Card.Body>
              <Card.Title className="mb-3 text-center">Login</Card.Title>

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Digite seu email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" placeholder="Digite sua senha" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button variant="primary" type="submit">
                    Entrar
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <Button variant="link" href="/auth/register">
                  Não tem conta? Cadastre-se
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
