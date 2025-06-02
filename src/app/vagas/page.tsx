"use client"
import { useAuth } from "@/context/AuthContext"
export default function vagasPage () {
    const {user, token} = useAuth()

    return (
        <div>
            <p>{token}</p>
            {JSON.stringify(user)}
        </div>
    )
}