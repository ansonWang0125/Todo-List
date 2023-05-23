import React, { useState, useRef, FormEvent } from 'react';
import './css/login.css';
import Paper from '@mui/material/Paper';

function Login() {
    const [userData, setUserData] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // await loginUser({
        //     userData: userData,
        //     password
        // });
        
        // setClick(!click)
    }

    const checkValid = () => {
        if (emailRef.current && emailRef.current.value === ''){
            emailRef.current.setCustomValidity("Email can not be empty."); 
        } else {
            emailRef.current?.setCustomValidity("")
        }
        if (passwordRef.current && passwordRef.current.value === ''){
            passwordRef.current.setCustomValidity("Password can not be empty.");
        } else {
            passwordRef.current?.setCustomValidity("")
        }
    }

    return (
        <div className="login">
            <div id="paper">
            {/* <Paper id="paper" elevation={3}> */}
                <h3>Please Login First</h3>
                <form id="info" ref={formRef} onSubmit={handleLogin}>
                    <div id='input'>
                        <input type="text" ref={emailRef} placeholder="User Name" className="inputInfos inputField" onChange={e=>setUserData(e.target.value)} />
                        <input type="password" ref={passwordRef} placeholder="Password" className="inputInfos inputField" onChange={e=>setPassword(e.target.value)}/>
                        <input type="submit" value="Login" className="inputInfos" id="login" onClick={checkValid}/>
                    </div>
                </form>
                </div>
            {/* </Paper> */}
        </div>
    );
}

export default Login;