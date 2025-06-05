'use client'


import { Container, Row, Col, Button } from 'react-bootstrap';
//eu tava feliz colocando comentários no backend, 
// mas aqui no front é uma desgraça colocar comentarios dentro de jsx


export default function LandingPage() {
  return (
    <Container className="my-5">
      
      
      <Row className="mb-4">
        <Col className="p-4 bg-light rounded shadow-sm">
          <h2>Sobre o Projeto Hospital</h2>
          <p>
            Nosso projeto conecta voluntários a hospitais que precisam de apoio.
            Acreditamos que, juntos, podemos transformar o cuidado e oferecer mais humanidade aos pacientes.
          </p>
        </Col>
      </Row>

      
      <Row className="mb-4">
        <Col className="p-4 bg-light rounded shadow-sm">
          <h2>Serviços Voluntários</h2>
          <p>
            Oferecemos diversas formas de atuação, como apoio emocional, atividades recreativas,
            organização de eventos e auxílio administrativo.
          </p>
        </Col>
      </Row>

     
      <Row>
        <Col className="d-flex justify-content-center gap-3">
          <Button variant="primary" href="/auth/login">
            Login
          </Button>
          <Button variant="success" href="/auth/signup">
            Registro
          </Button>
        </Col>
      </Row>

    </Container>
  )
}


/* Gostei desse exemplo aqui, vou usar depois
      <Container className="my-5">
        <h2 className="text-center mb-5 fw-bold">Serviços Voluntários</h2>
        <Row>
          <Col md={3} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="text-center">
                <Heart color="#0d6efd" size={48} className="mb-3" />
                <Card.Title>Apoio Emocional</Card.Title>
                <Card.Text>
                  Acompanhamento humanizado para pacientes e familiares.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="text-center">
                <People color="#0d6efd" size={48} className="mb-3" />
                <Card.Title>Atividades Recreativas</Card.Title>
                <Card.Text>
                  Dinâmicas e atividades para melhorar o dia dos pacientes.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="text-center">
                <Calendar color="#0d6efd" size={48} className="mb-3" />
                <Card.Title>Organização de Eventos</Card.Title>
                <Card.Text>
                  Ajude a planejar eventos especiais no hospital.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="text-center">
                <Clipboard color="#0d6efd" size={48} className="mb-3" />
                <Card.Title>Auxílio Administrativo</Card.Title>
                <Card.Text>
                  Suporte nas áreas administrativas do hospital.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
*/
     