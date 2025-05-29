'use client'

import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
//cansei de botar dentro do jsx, vou falar aqui msm
//Componentes interessantes usados:
//Container/row/col, Card, Form/formGroup e Button

export default function RegisterPage() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row>
        <Col>
          <Card className="p-4 shadow" style={{ width: '20rem' }}>
            <Card.Body>
              <Card.Title className="mb-3 text-center">Cadastro</Card.Title>

              <Form>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" placeholder="Digite seu nome" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Digite seu email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" placeholder="Digite sua senha" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control type="password" placeholder="Confirme sua senha" />
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
