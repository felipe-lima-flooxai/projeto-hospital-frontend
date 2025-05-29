'use client'

import { Container, Row, Col, Button } from 'react-bootstrap';
//eu tava feliz colocando comentários no backend, 
// mas aqui no front é uma desgraça colocar comentarios dentro de jsx


export default function LandingPage() {
  return (
    <Container className="my-5">
      
      {/* Row 1 - Uma breve introdução do projeto (Só pra encher linguiça) */}
      <Row className="mb-4">
        <Col className="p-4 bg-light rounded shadow-sm">
          <h2>Sobre o Projeto Hospital</h2>
          <p>
            Nosso projeto conecta voluntários a hospitais que precisam de apoio.
            Acreditamos que, juntos, podemos transformar o cuidado e oferecer mais humanidade aos pacientes.
          </p>
        </Col>
      </Row>

      {/* Row 2 - Tipos de serviços (A modificar, também para encher linguiça) */}
      <Row className="mb-4">
        <Col className="p-4 bg-light rounded shadow-sm">
          <h2>Serviços Voluntários</h2>
          <p>
            Oferecemos diversas formas de atuação, como apoio emocional, atividades recreativas,
            organização de eventos e auxílio administrativo.
          </p>
        </Col>
      </Row>

      {/* Row 3 - Botões de chamamento pra participar do projeto
      Tentei imitar alguns sites de psicologia que vi,
      Porém não ficou muito bom. Pretendo mudar
      */}
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
