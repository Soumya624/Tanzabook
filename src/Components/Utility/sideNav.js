import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URI } from '../Network/config'

export default function SideNav(props) {

    const [inputValue, setInputValue] = useState("")


    const addFolderList = async () => {
        axios.post(`${API_URI}/projects`, {
            "project": {
                "name": inputValue
            },
        }, {
            headers: {
                'Authorization': localStorage.getItem('tbztoken')
            }
        }).then(result => {
            if (result.status === 200) {
                props.getFolderList()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    const onClick = () => {
        if (inputValue) {
            addFolderList()
            // const nextState = [...folder, inputValue];
            // setFolder(nextState);
            setInputValue("")
        }
    }

    const onChange = (e) => setInputValue(e.target.value);

    return (
        <div className="sidebar">
            <div className="p-3">
                <div className="">
                    <input className="form-control" type="text" value={inputValue} onChange={(e) => onChange(e)} placeholder="Add New Folder" />
                    <button type="button" className="btn btn-outline-secondary add-btn" onClick={() => onClick()}>Add</button>
                </div>
            </div>
            <ul>
                {
                    props.folder.map(x => {
                        return (
                            // <li className="project-list" key={x.id} onClick={() => props.setProject(x)}>{x.name}</li>
                            <li className="project-list" key={x.id} >{x.name}</li>
                        )
                    })
                }
            </ul>
        </div>
    )
}