import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function TopNav() {

    const Logout = () => {
        localStorage.clear()
        window.location.href = "/"
    }

    useEffect(() => {
        if (localStorage.getItem('tbztoken') === null) {
            window.location.href = "/"
        }
    }, [])

    return (
        <div>
            <nav class="navbar navbar-light bg-light">
                <Link to="/home" style={{ textDecoration: 'none' }}><span class="navbar-brand mb-0 h1 p-2">Tanzabooks</span></Link>
                <button type="button" className="btn btn-outline-secondary logout-btn" onClick={() => Logout()}>Logout</button>
            </nav>
        </div>
    )
}