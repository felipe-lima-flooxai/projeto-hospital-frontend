"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Badge,
  ListGroup,
} from "react-bootstrap";

interface User {
  id: string;
  username: string;
  email: string;
  fullname: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  totalPoints: number;
  scolarity: string | null;
  birthDate: string | null;
  cpf: string | null;
  profession: string | null;
  adress: string | null;
  cep: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const token = getCookie("token") as string

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Authorization: token || "",
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar usuários");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token || "",
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar usuário");

      setSuccess("Usuário deletado com sucesso");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString("pt-BR") : "-";

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Administração de Usuários</h2>

      {error && <Alert variant="danger" dismissible onClose={()=> setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={()=> setSuccess(null)}>{success}</Alert>}

      {loading ? (
        <div className="d-flex justify-content-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row xs={1} md={2} lg={2} className="g-4 mt-3">
          {users.map((user) => (
            <Col key={user.id}>
              <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>{user.fullname || user.username}</strong>
                  <Badge bg={user.isAdmin ? "success" : "secondary"}>
                    {user.isAdmin ? "Admin" : "Usuário"}
                  </Badge>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Email:</strong> {user.email}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Username:</strong> {user.username}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Pontos:</strong> {user.totalPoints}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>CPF:</strong> {user.cpf || "-"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Profissão:</strong> {user.profession || "-"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Escolaridade:</strong> {user.scolarity || "-"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>CEP:</strong> {user.cep || "-"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Endereço:</strong> {user.adress || "-"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Nascimento:</strong> {formatDate(user.birthDate)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Criado em:</strong> {formatDate(user.createdAt)}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Deletar
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
