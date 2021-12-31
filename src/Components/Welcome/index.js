import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { API_URI } from '../Network/config'
import SideNav from '../Utility/sideNav'
import TopNav from '../Utility/topNav'

export default function Welcome() {

    const [file, setFile] = useState()
    const [redirect, setRedirect] = useState(false)
    const [project, setProject] = useState()
    const [folder, setFolder] = useState([])

    useEffect(() => {
        getFolderList()
    }, [])

    const getFolderList = async () => {
        axios.get(`${API_URI}/projects`, {
            headers: {
                'Authorization': localStorage.getItem('tbztoken')
            }
        })
            .then(result => {
                if (result.status === 200) {
                    setFolder(result.data.data)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }



    if (redirect) {
        return <Redirect to="/annotator" />
    }



    return (

        <div>
            <TopNav />
            <div className="row">
                <div className="col-2">
                    <SideNav folder={folder} getFolderList={() => getFolderList()} setProject={(data) => setProject(data)} />
                </div>
                <div className="col-10">
                    <div className="mt-2">
                        Welcome to Tanzabooks
                       
                        {
                            <div className="row">
                                {
                                    folder.map(x => {
                                        return (
                                            <div className="col-2">
                                                < Link to={{
                                                    pathname: '/project',
                                                    state: {
                                                        data: x,
                                                    }
                                                }}>
                                                    <img src="./folder.png" style={{ width: '100px', height: '100px' }} />
                                                </Link>
                                                <br />
                                                <div style={{ marginLeft: '5%', marginTop: '-10px' }}>
                                                    < Link to={{
                                                        pathname: '/project',
                                                        state: {
                                                            data: x,
                                                        }
                                                    }} style={{ color: 'black', textDecoration: 'none' }}>{x.name}</Link>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >

    )
}