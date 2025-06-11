"use client"

import { useEffect, useState } from "react"
import { Container, ButtonGroup, Button, Row, Col, Card, ListGroup, Badge, Pagination } from "react-bootstrap"

interface usuarioLeaderboard {
    username: string
    totalPoints: number
    createdAt: Date
}


export default function showLeaderboard(){
    const [users, setUsers] = useState<usuarioLeaderboard[]>([])
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);

    useEffect(()=>{
        const fetchLeaderboard = async () => {
            const params = new URLSearchParams()
            params.append("page", page.toString())
            params.append("limit", limit.toString())

            try {
                const response  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard?${params.toString()}`)

                if(!response.ok) throw new Error("Erro ao buscar ranking")

                const data = await response.json()
                setUsers(data.users)
                setTotal(data.total)

            } catch(err){
                setError((err as Error).message )
            }
        }
        fetchLeaderboard()

    }, [page, limit])

    const totalPages = Math.ceil(total / limit);

    const handleLimit = (limit: number) => {
        setLimit(limit);
        setPage(1)
    }


    return (
        <Container>
            <h2 className="mb-4">Ranking de Voluntários ({total})</h2>
            <ButtonGroup className="mb-3 center">
                <Button variant={limit == 10 ? "warning" : "outline-warning"} onClick={()=> handleLimit(10)}>10 em 10</Button>
                <Button variant={limit == 20 ? "warning" : "outline-warning"} onClick={()=> handleLimit(20)}>20 em 20</Button>
                <Button variant={limit == 30 ? "warning" : "outline-warning"} onClick={()=> handleLimit(30)}>30 em 30</Button>
            </ButtonGroup>

            <ListGroup>
                {users.map((user, index) => (
                    <ListGroup.Item
                    key={index}
                    className="rounded shadow mb-2 p-3"
                    >
                    <div
                        style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1fr 1fr', 
                        alignItems: 'center',
                        gap: '1rem',
                        width: '100%',
                        }}
                    >
                        <div>
                        <Badge bg="primary">{index + 1}º</Badge>
                        </div>

                        <div className="text-truncate">
                        <strong>{user.username || 'Username não informado'}</strong>
                        </div>

                        <div>
                        <strong>Pontos:</strong> {user.totalPoints}
                        </div>

                        <div>
                        <strong>Criado em:</strong> {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                    </ListGroup.Item>
                ))}
                </ListGroup>

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


    )


}