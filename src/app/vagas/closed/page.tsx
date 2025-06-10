'use client';
import { useAuth } from '@/context/AuthContext';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button, ButtonGroup, Pagination, Alert, Badge } from 'react-bootstrap';

interface Usuario {
  id: string;
  username: string;
  fullname: string;
}

interface Candidatura {
  id: string;
  status: string;
  usuario: Usuario;
}

interface VagaFechada {
  id: string;
  title: string;
  description: string;
  type: string;
  rewardPoints: number;
  taskDate: string;
  status: string;
  candidaturas: Candidatura[];
}

export default function VagasFechadasPage() {
  const [vagas, setVagas] = useState<VagaFechada[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [minRewardFilter, setMinRewardFilter] = useState<number | null>(null);
  const [errorMessage, setError] = useState<string | null>(null);
  const [successMessage, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();
  const token = getCookie("token") as string;

  const fetchVagasFechadas = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (typeFilter) params.append('type', typeFilter);
    if (minRewardFilter) params.append('minRewardPoints', minRewardFilter.toString());

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vagas/fechadas?${params.toString()}`, {
        headers: {
          Authorization: token || '',
        },
      });

      if (!response.ok) throw new Error('Erro ao buscar vagas fechadas');

      const data = await response.json();
      setVagas(data.vagas);
      setTotal(data.total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchVagasFechadas();
    }
  }, [page, typeFilter, minRewardFilter, limit, user]);

  const handleDeleteVaga = async (vagaId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vagas/${vagaId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Erro ao deletar vaga");
        return;
      }

      setSuccess("Vaga deletada com sucesso.");
      setVagas(prev => prev.filter(v => v.id !== vagaId));
    } catch (err) {
      console.error(err);
      setError("Erro na requisição ao deletar vaga");
    }
  };

  const totalPages = Math.ceil(total / limit);

  const handleLimit = (limit: number) => {
    setLimit(limit);
    setPage(1);
  };

  const handleTypeFilter = (type: string | null) => {
    setTypeFilter(type);
    setPage(1);
  };

  const handleMinRewardFilter = (points: number | null) => {
    setMinRewardFilter(points);
    setPage(1);
  };

  if (!user?.isAdmin) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Acesso negado. Apenas administradores podem ver esta página.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {successMessage && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger" dismissible onClose={() => setError(null)}>{errorMessage}</Alert>}
      
      <h2 className="mb-4">Vagas Fechadas</h2>

      {/* Filtros */}
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
        <Button variant={limit === 5 ? "warning" : "outline-warning"} onClick={() => handleLimit(5)}>5 em 5</Button>
        <Button variant={limit === 10 ? "warning" : "outline-warning"} onClick={() => handleLimit(10)}>10 em 10</Button>
        <Button variant={limit === 20 ? "warning" : "outline-warning"} onClick={() => handleLimit(20)}>20 em 20</Button>
      </ButtonGroup>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <>
          <Row>
            {vagas.map((vaga) => (
              <Col key={vaga.id} md={4} className="mb-4">
                <Card className="h-100 shadow">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title>{vaga.title}</Card.Title>
                      <Badge bg="secondary">Fechada</Badge>
                    </div>
                    <Card.Subtitle className="mb-2 text-muted">{vaga.type}</Card.Subtitle>
                    <Card.Text>{vaga.description}</Card.Text>
                    <Card.Text><strong>Pontos:</strong> {vaga.rewardPoints}</Card.Text>
                    <Card.Text><strong>Data:</strong> {new Date(vaga.taskDate).toLocaleDateString('pt-BR')}</Card.Text>
                    
                    {vaga.candidaturas.length > 0 && (
                      <Card.Text>
                        <strong>Aprovado:</strong> <Badge bg="success">{vaga.candidaturas[0].usuario.fullname}</Badge>
                      </Card.Text>
                    )}
                    
                    <Button 
                      variant="danger" 
                      className="mt-2" 
                      onClick={() => handleDeleteVaga(vaga.id)}
                    >
                      Deletar Vaga
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {vagas.length === 0 && (
            <Alert variant="info">Nenhuma vaga fechada encontrada.</Alert>
          )}

          {totalPages > 1 && (
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
          )}
        </>
      )}
    </Container>
  );
}
