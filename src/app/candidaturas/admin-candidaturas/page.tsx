"use client"

import { useEffect, useState } from "react";
import { Accordion, Card, Spinner, ListGroup, Badge, Container, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { getCookie } from "cookies-next";

interface Usuario {
  id: string;
  username: string;
  fullname: string;
}

interface Candidatura {
  id: string;
  userID: string;
  vagaID: string;
  status: string;
  usuario: Usuario;
}

interface Vaga {
  id: string;
  title: string;
  description: string;
  status: string;
  rewardPoints: number;
  taskDate: string;
  candidaturas: Candidatura[];
}

export default function AdminCandidaturas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [aprovandoCandidatura, setAprovandoCandidatura] = useState<string | null>(null);
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const token = getCookie("token") as string;

  const fetchCandidaturas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidatura/todas`, {
        headers: {
          Authorization: ` ${token}`,
        },
      });

      const data = await res.json();
      setVagas(data);
    } catch (err) {
      console.error("Erro ao buscar candidaturas:", err);
      setAlert({ type: 'error', message: 'Erro ao carregar candidaturas' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidaturas();
  }, []);

  const aprovarCandidatura = async (candidaturaId: string, nomeUsuario: string) => {
    setAprovandoCandidatura(candidaturaId);
    
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidatura/${candidaturaId}/aprovar`,
        {},
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      setAlert({ 
        type: 'success', 
        message: `Candidatura de ${nomeUsuario} aprovada com sucesso! Pontos foram creditados.` 
      });

      // Recarrega os dados para mostrar as mudanças
      await fetchCandidaturas();

    } catch (error: any) {
      console.error("Erro ao aprovar candidatura:", error);
      const errorMessage = error.message || "Erro ao aprovar candidatura";
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setAprovandoCandidatura(null);
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aberta': return 'success';
      case 'fechada': return 'secondary';
      case 'pendente': return 'warning';
      case 'aprovado': return 'success';
      case 'rejeitado': return 'danger';
      default: return 'info';
    }
  };

  if (loading) return <Spinner animation="border" className="m-5" />;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Todas as Vagas e Candidaturas</h2>
      
      {alert && (
        <Alert 
          variant={alert.type === 'success' ? 'success' : 'danger'} 
          dismissible 
          onClose={() => setAlert(null)}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <Accordion defaultActiveKey="0">
        {vagas.map((vaga, index) => (
          <Accordion.Item eventKey={index.toString()} key={vaga.id}>
            <Accordion.Header>
              {vaga.title}{" "}
              <Badge bg={getBadgeColor(vaga.status)} className="ms-2">{vaga.status}</Badge>
              <Badge bg="secondary" className="ms-2">
                {vaga.candidaturas.length} candidatura{vaga.candidaturas.length !== 1 && "s"}
              </Badge>
            </Accordion.Header>
            <Accordion.Body>
              <p><strong>Descrição:</strong> {vaga.description}</p>
              <p><strong>Data:</strong> {new Date(vaga.taskDate).toLocaleDateString()}</p>
              <p><strong>Pontos:</strong> {vaga.rewardPoints} pontos</p>

              {vaga.candidaturas.length > 0 ? (
                <ListGroup>
                  {vaga.candidaturas.map((c) => (
                    <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{c.usuario.fullname}</strong> ({c.usuario.username}) —{" "}
                        <Badge bg={getBadgeColor(c.status)} text={c.status === 'Pendente' ? 'dark' : 'white'}>
                          {c.status}
                        </Badge>
                      </div>
                      
                      {/* Botão de aprovar só aparece se a vaga estiver aberta e a candidatura estiver pendente */}
                      {vaga.status === 'Aberta' && c.status === 'Pendente' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => aprovarCandidatura(c.id, c.usuario.fullname)}
                          disabled={aprovandoCandidatura === c.id}
                        >
                          {aprovandoCandidatura === c.id ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Aprovando...
                            </>
                          ) : (
                            'Aprovar'
                          )}
                        </Button>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">Nenhuma candidatura nesta vaga.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}