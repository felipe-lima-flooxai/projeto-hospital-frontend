'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { Form, Button, Container, Alert } from 'react-bootstrap';

export default function CreateVagaPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const [taskDate, setTaskDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const token = getCookie("token") as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Você precisa estar logado para criar uma vaga.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vagas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ title, description, type, rewardPoints, taskDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao criar vaga.");
        return;
      }

      setSuccess("Vaga criada com sucesso!");
      setTimeout(() => router.push('/vagas'), 1500); // redireciona após 1.5s
    } catch (err) {
      console.error(err);
      setError("Erro na requisição.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Criar Nova Vaga</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipo</Form.Label>
          <Form.Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            <option value="Idosos">Idosos</option>
            <option value="Criancas">Crianças</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Pontos de Recompensa</Form.Label>
          <Form.Control
            type="number"
            value={rewardPoints}
            onChange={(e) => setRewardPoints(parseInt(e.target.value))}
            min={0}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Data da Tarefa</Form.Label>
          <Form.Control
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Criar Vaga
        </Button>
      </Form>
    </Container>
  );
}
