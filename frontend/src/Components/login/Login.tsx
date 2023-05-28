import React, { useState, useRef, FormEvent, useEffect } from 'react';
import './css/login.css';
// import Paper from '@mui/material/Paper';
import { apiUserLogin } from '../../axios/api';
import { useLoginContext } from '../../Context/LoginCtx';
import { toast } from 'react-toastify';
import { useUserContext } from '../../Context/UserCtx';

interface UserData {
    name: string;
    password: string;
  }

function Login() {
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [success, setSuccess] = useState<boolean>(false);
    const [logoutSucc, setLogoutSucc] = useState<boolean>(false);
    const [passworderror, setPassworderError] = useState<boolean>(false);
    const [click, setClick] = useState<boolean>(false);
    const {login, changeLogin} = useLoginContext();
    const {user, changeUser} = useUserContext();

    useEffect ( () => {
        if (success) {
            toast.success('登入成功 ! ', {
                position:toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            })
            // navigate('/')
            window.location.reload()
        }
        if (logoutSucc) {
            toast.success('登出成功 ! ', {
                position:toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            })
            // window.location.reload(true)
        }
        if (passworderror) {
            toast.warning('密碼有誤 ! ', {
                position:toast.POSITION.TOP_CENTER,
                className: 'toast-warning'
        })}
    }, [success, passworderror, click, changeLogin, logoutSucc])

    const setAlert = (succ: boolean, logoutsucc: boolean, pass: boolean) => {
        setSuccess(succ)
        setLogoutSucc(logoutsucc)
        setPassworderError(pass)
    }

    async function loginUser(credentials: UserData) {
        try {
          const response = await apiUserLogin(credentials);
          if (response.status === 200) {
            const token = response.headers['x-auth-token'];
            const responseData = response.data;
            console.log(token)
            localStorage.setItem('user', JSON.stringify({ token, name: responseData.name }));
            console.log('success');
            console.log('response = ', responseData);
            changeUser(responseData.name);
            console.log(responseData.name);
            changeLogin(true);
            setAlert(true, false, false);
            return responseData;
          }
        } catch (reason: any){ 
            let response = reason.response
            if (response.status === 400) {
                if (response.data.message === 'Password incorrect'){
                    setAlert(false, false, true)
                } else if (response.data.message === 'User name not found'){
                    setAlert(false, true, false)
                }            
            }
        }
    }
      

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await loginUser({
            name,
            password
        });
        
        setClick(!click)
    }

    const logout = () => {
        changeLogin(false);
        localStorage.removeItem('user')
        setAlert(false, true, false)
    }

    const checkValid = () => {
        if (emailRef.current && emailRef.current.value === ''){
            emailRef.current.setCustomValidity("User name can not be empty."); 
        } else {
            emailRef.current?.setCustomValidity("")
        }
    }

    return (
        <div className="login">
            <div id="paper">
            {login? 
            <>
                <h3>{"Welcome!  "+ user}</h3>
                <button id="logout" onClick={logout}>Logout</button>
            </>
            :
            <>
                <h3>Please Login First</h3>
                <form id="info" ref={formRef} onSubmit={handleLogin}>
                    <div id='input'>
                        <input type="text" ref={emailRef} placeholder="User Name" className="inputInfos inputField" onChange={e=>setName(e.target.value)} />
                        <input type="password" ref={passwordRef} placeholder="Password" className="inputInfos inputField" onChange={e=>setPassword(e.target.value)}/>
                        <input type="submit" value="Login" className="inputInfos" id="login" onClick={checkValid}/>
                    </div>
                </form>
            </> 
            }
            </div>
        </div>
    );
}

export default Login;