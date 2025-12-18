import React, { useState } from 'react'
import { BASE_URL } from '../../utils/constants'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {setAdmin} from "../../store/adminSlice"
import "./LoginPage.css"
const LoginPage = () => {

    const [emailId, setEmailId] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState("")
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleClick = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post(`${BASE_URL}/admin/login`, {
                emailId: emailId,
                password: password
            },
            {withCredentials: true});
            dispatch(setAdmin(res?.data?.data));
            navigate("/dashboard");

        }catch(err){
            setErrors(err.response.data);
        }
    }

  return (
    <div className="login-page">
        <h1>Noor-e-chandani Admin Panel</h1>
        <form onSubmit={handleClick}>
            <div className='form-rows'>
                <label className='labels'>EmailId:</label>
                <input className='inputs' type="email" onChange={(e) => setEmailId(e.target.value)} value={emailId}/>
            </div>
            <div className='form-rows'>
                <label className='labels'>Password:</label>
                <input className='inputs' type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            </div>
            {errors && <p>{errors}</p>}
            <button className='login-button' type='submit'>Login</button>
        </form>
    </div>
  )
}

export default LoginPage