'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
//cansei de botar dentro do jsx, vou falar aqui msm
//Componentes interessantes usados:
//Container/row/col, Card, Form/formGroup e Button

export default function RegisterPage() {
    const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        setError('Erro ao cadastrar!');
        return;
      }

      setSuccess('Cadastro realizado com sucesso!');
    
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
                  <Form.Control type="text" placeholder="Digite seu nome" value={name} onChange={(e)=> setName(e.target.value)}/>
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
