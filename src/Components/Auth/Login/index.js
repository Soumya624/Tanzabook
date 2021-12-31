import axios from 'axios'
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { API_URI } from '../../Network/config'
import '../auth.css'

export default function Login() {

    const [data, setData] = useState({})
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState("")
    const [loader, setLoader] = useState(false)

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoader(true)
        setError("")
        await axios.post(`${API_URI}/sessions`, {
            email: data.email,
            password: data.password
        }).then(result => {
            if (result.status === 200) {
                localStorage.setItem('tbztoken', result.data.auth_token)
                setRedirect(true)
                setLoader(false)
            }
        }).catch(error => {
            setError(error?.response?.data?.error?.user_authentication || "Please Try Again....")
            setLoader(false)
        })
    }

    if (redirect) {
        return <Redirect to="/home" />
    }

    return (
        <div className="main-bg">
            <div className="container">
                <div className="form-box">
                    <div className="header-form">
                        {/* <h4 className="text-primary text-center"><i className="fa fa-user-circle" style={{ fontSize: "110px" }}></i></h4> */}
                        <h4 className="text-primary text-center">Tanzabooks</h4>
                        <div className="image">
                        </div>
                    </div>
                    <div className="body-form">
                        <form onSubmit={(e) => handleLogin(e)}>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fa fa-envelope"></i></span>
                                </div>
                                <input type="email" className="form-control" name="email" placeholder="Email" required onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fa fa-lock"></i></span>
                                </div>
                                <input type="password" className="form-control" name="password" placeholder="Password" required onChange={(e) => handleChange(e)} />
                            </div>
                            {
                                <div style={{ color: 'red' }} className="mt-1 mb-2">
                                    {error}
                                </div>
                            }
                            <button type="submit" className="btn btn-secondary btn-block">{loader ? "Loading..." : "Login"}</button>
                            <div className="message" style={{ color: 'black' }}>
                                <div><input type="checkbox" /> Remember Me</div>
                                <div style={{ color: 'white' }}><a style={{ color: 'black' }} href="/register">Create an Account</a></div>
                            </div>
                            <div className="message">
                                <div><a href="#" style={{ color: 'black' }}>Forgot your password</a></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}