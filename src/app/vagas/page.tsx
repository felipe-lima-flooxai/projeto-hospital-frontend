'use client';
import { useAuth } from '@/context/AuthContext';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button, ButtonGroup, Pagination, Spinner, Alert } from 'react-bootstrap';

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
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5)
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [minRewardFilter, setMinRewardFilter] = useState<number | null>(null);
  const [errorMessage, setError] = useState<string | null>(null);
  const [successMessage, setSuccess] = useState<string | null>(null)

  const {user} = useAuth()
  const token = getCookie("token") as string

  const handleCandidatar = async (vagaID: string) => {
    if(!token) {
      setError("Não há usuário logado")
      return
    }

  try {
    const response = await fetch('http://localhost:3001/candidatura', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify({ vagaID }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Erro ao se candidatar');
      return;
    }

    setSuccess('Candidatura realizada com sucesso!');
  } catch (error) {
    setError('Erro na requisição');
    console.error(error);
  }
};

  useEffect(() => {
    const fetchVagas = async () => {
      setError(null);
      setSuccess(null)

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      if (typeFilter) params.append('type', typeFilter);
      if (minRewardFilter) params.append('minRewardPoints', minRewardFilter.toString());

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vagas?${params.toString()}`);
        if (!response.ok) throw new Error('Erro ao buscar vagas');

        const data = await response.json();
        setVagas(data.vagas);
        setTotal(data.total);
      } catch (err) {
        setError((err as Error).message);
      } 
    };

    fetchVagas();
  }, [page, typeFilter, minRewardFilter, limit]);

  const totalPages = Math.ceil(total / limit);

  const handleLimit = (limit: number) => {
    setLimit(limit);
    setPage(1)
  }

  const handleTypeFilter = (type: string | null) => {
    setTypeFilter(type);
    setPage(1);
  };

  const handleMinRewardFilter = (points: number | null) => {
    setMinRewardFilter(points);
    setPage(1);
  };

  return (
    <Container className="mt-4">
      {/*Renderização condicional de mensagens de erro e sucesso */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <h2 className="mb-4">Vagas Disponíveis</h2>

      <ButtonGroup className="mb-3">
        <Button variant={typeFilter === null ? 'success' : 'outline-success'} onClick={() => handleTypeFilter(null)}>Todos</Button>
        <Button variant={typeFilter === 'Idosos' ? 'success' : 'outline-success'} onClick={() => handleTypeFilter('Idosos')}>Idosos</Button>
        <Button variant={typeFilter === 'Criancas' ? 'success' : 'outline-success'} onClick={() => handleTypeFilter('Criancas')}>Crianças</Button>
      </ButtonGroup>

      <ButtonGroup className="mb-3 ms-3">
        <Button variant={minRewardFilter === null ? 'primary' : 'outline-primary'} onClick={() => handleMinRewardFilter(null)}>Todos Pontos</Button>
        <Button variant={minRewardFilter === 10 ? 'primary' : 'outline-primary'} onClick={() => handleMinRewardFilter(10)}>+10</Button>
        <Button variant={minRewardFilter === 20 ? 'primary' : 'outline-primary'} onClick={() => handleMinRewardFilter(20)}>+20</Button>
      </ButtonGroup>

      <ButtonGroup className="mb-3 ms-2">
        <Button variant={limit == 5 ? "warning" : "outline-warning"} onClick={()=> handleLimit(5)}>5 em 5</Button>
        <Button variant={limit == 10 ? "warning" : "outline-warning"} onClick={()=> handleLimit(10)}>10 em 10</Button>
        <Button variant={limit == 20 ? "warning" : "outline-warning"} onClick={()=> handleLimit(20)}>20 em 20</Button>
      </ButtonGroup>

      <Row>
        {vagas.map((vaga) => (
          <Col key={vaga.id} md={4} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{vaga.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{vaga.type}</Card.Subtitle>
                <Card.Text>{vaga.description}</Card.Text>
                <Card.Text><strong>Pontos:</strong> {vaga.rewardPoints}</Card.Text>
                <Card.Text><strong>Data:</strong> {new Date(vaga.taskDate).toLocaleDateString('pt-BR')}</Card.Text>
                {user && (
                  <Button variant="success" className="mt-2" onClick={() => handleCandidatar(vaga.id)}> Candidatar-se </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center">
        <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
        <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <Pagination.Item key={num} active={num === page} onClick={() => setPage(num)}>
            {num}
          </Pagination.Item>
        ))}
        
        <Pagination.Next disabled={page === totalPages} onClick={() => setPage(page + 1)} />
        <Pagination.Last disabled={page === totalPages} onClick={() => setPage(totalPages)} />
      </Pagination>
    </Container>
  );
}
