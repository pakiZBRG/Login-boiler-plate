import React, {useState} from 'react';
import image from '../assets/register.jpg'
import {Link} from 'react-router-dom';

export default function Register() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const {username, email, password, passwordConfirm} = userData;

    const handleChange = text => e => setUserData({...userData, [text]: e.target.value})
    return (
        <div className='background'>
            <div className='background-flex'>
                <div className='flex-register'>
                    <h2>Create an Account</h2>
                    <form className='flex-form'>
                        <input
                            type='text'
                            value={username}
                            onChange={handleChange('username')}
                            placeholder='Username'
                        />
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
                        <input 
                            type='password'
                            value={passwordConfirm}
                            onChange={handleChange('passwordConfirm')}
                            placeholder='Confirm password'
                        />
                        <input type='submit' value='Register'/>
                    </form>
                    <span className='separator'><p>or</p></span>
                    <Link to='/login' className='login-btn' style={{fontWeight: 'bold'}}>
                        Login
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
