'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import {setCookie} from "cookies-next"
import { useAuth } from '@/context/AuthContext';
//cansei de botar dentro do jsx, vou falar aqui msm
//Componentes interessantes usados:
//Container/row/col, Card, Form/formGroup e Button

export default function RegisterPage() {
    const [username, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setAuthData } = useAuth();

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        setError('Erro ao cadastrar!');
        return;
      }

      setSuccess('Cadastro realizado com sucesso!');

      const { token, user } = await response.json();
      setAuthData(token, user);
      
      setCookie('token', `${token}`, {
        path: '/',        
        maxAge: (60 * 60 * 24)/3, // 8 horas igual o do backend. Daí ele apaga automaticamente.
      });
    
      router.push('/vagas');

    } catch (err) {
      console.error(err);
      setError('Algo inesperado aconteceu. Tente novamente mais tarde.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row>
        <Col>
          <Card className="p-4 shadow" style={{ width: '20rem' }}>
            <Card.Body>
              <Card.Title className="mb-3 text-center">Cadastro</Card.Title>

              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" placeholder="Digite seu nome" value={username} onChange={(e)=> setName(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Digite seu email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" placeholder="Digite sua senha" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control type="password" placeholder="Confirme sua senha" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)}/>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button variant="success" type="submit">
                    Cadastrar
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <Button variant="link" href="/auth/login">
                  Já tem conta? Faça login
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
