import React, { useState } from 'react';
import image from '../assets/login.jpg';
import axios from 'axios';
import { authenticate, isAuth } from '../helpers/auth';
import { ToastContainer, toast } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom';

export default function Login({history}) {
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const handleChange = text => e => setUserData({...userData, [text]: e.target.value});
    
    const {email, password} = userData;

    const handleSubmit = e => {
        e.preventDefault();
        if(email && password) { 
            axios.post('/users/login', {email ,password})
                .then(res => {
                    authenticate(res, () => {
                        setUserData({
                            ...userData,
                            email: "",
                            password: ""
                        });
                    });
                    if(isAuth()){
                        history.push(`/user/${res.data.user.id}`);
                    }
                })
                .catch(err => toast.error(err.response.data.error));
        } else {
            toast.error('Please fill all fields');
        }
    }

    return (
        <div className='background'>
            {isAuth() ? <Redirect to='/'/> : null}
            <ToastContainer/>
            <div className='background-flex'>
                <div className='flex-register'>
                    <h2>Login</h2>
                    <form className='flex-form' onSubmit={handleSubmit}>
                        <input
                            type='email'
                            value={email}
                            onChange={handleChange('email')}
                            placeholder='Email'
                            autoComplete="nope"
                        />
                        <input
                            type='password'
                            value={password}
                            onChange={handleChange('password')}
                            placeholder='Password'
                        />
                        <input type='submit' value='Login'/>
                    </form>
                    <span className='separator'><p style={{margin: '2.5rem 0'}}>or</p></span>
                    <Link to='/register' className='login-btn' style={{fontWeight: 'bold'}}>
                        <i className='fa fa-user-plus' style={{marginRight: '0.5rem'}}></i>Create an account
                    </Link>
                    <Link to='/google' className='login-btn google'>
                        <i className='fa fa-google' style={{marginRight: '0.5rem'}}></i>Google
                    </Link>
                    <Link to='/facebook' className='login-btn facebook'>
                        <i className='fa fa-facebook' style={{marginRight: '0.5rem'}}></i>Facebook
                    </Link>
                </div>
                <img src={image} alt='register'/>
            </div>
        </div>
    )
}
