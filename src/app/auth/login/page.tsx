'use client'

import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
//mesma coisa do login, muda mt não

export default function LoginPage() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row>
        <Col>
          <Card className="p-4 shadow" style={{ width: '20rem' }}>
            <Card.Body>
              <Card.Title className="mb-3 text-center">Login</Card.Title>

              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Digite seu email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" placeholder="Digite sua senha" />
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
