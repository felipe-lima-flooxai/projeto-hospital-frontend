"use client"

'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';

export default function CandidaturaPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vaga, setVaga] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const vagaId = searchParams.get('vagaId'); // ?vagaId=123

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (vagaId) {
      fetch(`http://localhost:3001/vagas/${vagaId}`)
        .then((res) => res.json())
        .then((data) => setVaga(data))
        .catch(() => setError('Erro ao buscar vaga.'));
    }
  }, [vagaId]);

  const handleCandidatura = async () => {
    try {
      const res = await fetch('http://localhost:3001/candidaturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ` ${token}`,
        },
        body: JSON.stringify({ vagaId }),
      });

      if (!res.ok) throw new Error('Erro na candidatura.');

      setSuccess('Candidatura realizada com sucesso!');
    } catch (err) {
      setError('Erro ao se candidatar.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Detalhes da Vaga</Card.Title>

              {vaga ? (
                <>
                  <p><strong>Título:</strong> {vaga.titulo}</p>
                  <p><strong>Descrição:</strong> {vaga.descricao}</p>
                  <p><strong>Empresa:</strong> {vaga.empresa}</p>

                  {success && <Alert variant="success">{success}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Button variant="primary" onClick={handleCandidatura}>
                    Candidatar-se
                  </Button>
                </>
              ) : (
                <p>Carregando vaga...</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
