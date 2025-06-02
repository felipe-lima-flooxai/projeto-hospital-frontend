'use client'

import { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

//interface pra ter os atributos igual coloquei lá no backend
interface Vaga {
  id: string;
  title: string;
  description: string;
  type: string;
  rewardPoints: number;
  taskDate: string;
}

export default function VagasPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await fetch('http://localhost:3001/vagas');

        if (!response.ok) {
          throw new Error('Falha ao buscar vagas');
        }

        const data = await response.json();
        setVagas(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchVagas();
  }, []);

  

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Vagas Disponíveis</h2>
      <Row>
        {vagas.map((vaga) => (
          <Col key={vaga.id} md={4} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{vaga.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{vaga.type}</Card.Subtitle>
                <Card.Text>{vaga.description}</Card.Text>
                <Card.Text>
                  <strong>Pontos:</strong> {vaga.rewardPoints}
                </Card.Text>
                <Card.Text>
                  <strong>Data:</strong> {new Date(vaga.taskDate).toLocaleDateString('pt-BR')}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
