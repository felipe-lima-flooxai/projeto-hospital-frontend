'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';

interface Vaga {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
}

interface Candidatura {
  id: string;
  status: string;
  vaga: Vaga;
}

export default function MinhasCandidaturasPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    const fetchCandidaturas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidatura`, {
          headers: {
            Authorization: ` ${token}`,
          },
        });

        if (!res.ok) throw new Error('Erro ao buscar candidaturas.');

        const data = await res.json();
        setCandidaturas(data);
      } catch (err) {
        setError('Erro ao carregar suas candidaturas.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidaturas();
  }, [user, token, router]);

  useEffect(() => {
    if(error){
      const timer = setTimeout(()=>setError(null), 4000);
      return () => clearTimeout(timer)
    }
    }, [error]);

  const handleCancelar = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidatura/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao cancelar candidatura");

      // Remove a candidatura da lista
      setCandidaturas((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3>Minhas Candidaturas</h3>
      {error && <Alert variant="danger" dismissible onClose={()=>setError(null)}>{error}</Alert>}
      {candidaturas.length === 0 && <p>Você ainda não se candidatou a nenhuma vaga.</p>}

      <Row>
        {candidaturas.map((candidatura) => (
          <Col key={candidatura.id} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{candidatura.vaga.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Tipo: {candidatura.vaga.type}</Card.Subtitle>
                <Card.Text>{candidatura.vaga.description}</Card.Text>
                <p>Status da vaga: <strong>{candidatura.vaga.status}</strong></p>
                <p>Status da candidatura: <strong>{candidatura.status}</strong></p>
                <Button variant="danger" size="sm" onClick={() => handleCancelar(candidatura.id)}>Cancelar candidatura</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
