'use client'

import { useState, useEffect } from 'react'
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap'
import { useAuth } from '@/context/AuthContext'
import { getCookie } from 'cookies-next'

//função para poder colocar as datas no item de data do formulário
const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Retorna YYYY-MM-DD
  };

export default function EditarPerfilPage() {
  const { user, setAuthData } = useAuth()
  const token = getCookie('token') as string;

  //passando os valores do useAuth pra formData
  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    fullname: user?.fullname || '',
    scolarity: user?.scolarity || '',
    birthDate: formatDateForInput(user?.birthDate || ''),
    cpf: user?.cpf || '',
    profession: user?.profession || '',
    adress: user?.adress || '',
    cep: user?.cep || ''
  })

  const formattedFormData = {
  ...formData,
  birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null
}

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  //função pra fazer 1 handle em vez de 8 handles dos itens dos formulários
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  //toda a parte de request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:3001/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ` ${token}`
        },
        body: JSON.stringify(formattedFormData)
      })

      if (!res.ok) {
        throw new Error('Erro ao atualizar perfil')
      }

      const updatedUser = await res.json()

      setAuthData(token!, updatedUser) // Atualiza o contexto com o novo user
      setSuccessMessage('Perfil atualizado com sucesso!')
      setErrorMessage('')
    } catch (err) {
      console.error(err)
      setErrorMessage('Erro ao atualizar perfil.')
      setSuccessMessage('')
    }
  }

  return user ? (<Container>
      <h1 className="my-4">Editar Perfil</h1>

      {/*Renderização condicional de mensagens de erro e sucesso */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col >
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Escolaridade</Form.Label>
              <Form.Control
                type="text"
                name="scolarity"
                value={formData.scolarity || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data de Nascimento</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={formData.birthDate || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type="text"
                name="cpf"
                value={formData.cpf || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profissão</Form.Label>
              <Form.Control
                type="text"
                name="profession"
                value={formData.profession || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                name="adress"
                value={formData.adress || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                type="text"
                name="cep"
                value={formData.cep || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <hr />

            <Form.Group className="mb-3">
              <Form.Label>Criado em</Form.Label>
              <Form.Control type="text" value={new Date(user!.createdAt).toLocaleString()} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Atualizado em</Form.Label>
              <Form.Control type="text" value={new Date(user!.updatedAt).toLocaleString()} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Administrador</Form.Label>
              <Form.Control type="text" value={user!.isAdmin ? 'Sim' : 'Não'} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total de Pontos</Form.Label>
              <Form.Control type="number" value={user!.totalPoints ?? ''} readOnly />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="success" type="submit">
          Salvar Alterações
        </Button>
      </Form>
    </Container>): null 
    
  
}
