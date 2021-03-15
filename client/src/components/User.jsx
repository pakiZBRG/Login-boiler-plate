import React, { useState, useEffect } from 'react';
import { isAuth, signout } from '../helpers/auth';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom'
import cookie from 'js-cookie';


export default function User({match, history}) {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [userData, setUserData] = useState({
        username: "",
            email: ""
    });

    const token = cookie.get('token');
    const loggedUser = localStorage.getItem('user');

    useEffect(() => {
        if(token || loggedUser){
            axios.get(`/users/${userId}`)
                .then(res => {
                    toast.success(`Welcome, ${res.data.username}`)
                    setUserData({
                        _id: res.data._id,
                        username: res.data.username,
                        email: res.data.email
                    })
                })
                .catch(err => toast.error(err.response.data.error));
        }
    }, [match.params]);

    const {username, email} = userData;

    return (
        <div className='background'>
            <ToastContainer/>
            <div className='background-white'>
                {isAuth() ?
                    <div className='background-login'>
                        <h2>Welcome, <span style={{color: 'crimson'}}>{username}</span></h2>
                        <h2>You signed in with <span style={{color: 'crimson'}}>{email}</span> email</h2>
                        <button
                            onClick={() => {
                                signout(() => history.push('/'));
                            }}
                        >
                            <i className='fa fa-sign-out' style={{marginRight: '0.4rem'}}/>Signout
                        </button>
                    </div>
                        :
                    <div className='background-login'>
                        <h2>Access denied to unauthorized users</h2>
                        <Link to='/login'>
                            <button><i className='fa fa-user' style={{marginRight: '0.4rem'}}/>Login</button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    )
}