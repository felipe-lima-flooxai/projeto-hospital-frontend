"use client"

import { useState } from "react"
import { Container, Form, Button, Alert } from "react-bootstrap"

export default function CreateAdminPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullname: "",
    })

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((previousData) => ({ ...previousData, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        const { username, email, password, confirmPassword, fullname } = formData

        if (!username || !email || !password || !confirmPassword || !fullname) {
            return setError("Preencha todos os campos")
        }

        if (password !== confirmPassword) {
            return setError("As senhas não coincidem")
        }


        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    fullname,
                    isAdmin: true,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Erro ao cadastrar administrador")
            }

            setSuccess("Administrador cadastrado com sucesso!")
            setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                fullname: "",
            })
        } catch (error: any) {
            setError(error.message)
        }
    }

    return (
        <Container className="mt-4" style={{ maxWidth: "600px" }}>
            <h2>Cadastrar Novo Administrador</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome completo</Form.Label>
                    <Form.Control type="text" name="fullname" value={formData.fullname} onChange={handleChange} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Usuário</Form.Label>
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirmar Senha</Form.Label>
                    <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}required/>
                </Form.Group>

                <div className="d-flex justify-content-end">
                    <Button type="submit" variant="success" > Cadastrar Admin </Button>
                </div>
            </Form>
        </Container>
    )
}
