import React, { ButtonHTMLAttributes, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";

function Login()
{
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });

    const [err,setError] = useState(null);

    const navigate = useNavigate();

    const {login} = useContext(AuthContext);

    /*Function for handling changes on the form for user data.*/
    const handleChange = (e: React.ChangeEvent<any>) =>{
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async(e: React.ChangeEvent<any>) => {
        e.preventDefault()

        try{
            await login(inputs);
            navigate("/");
        }catch(err: any){
            setError(err.response.data);
        }
    };

    return(
        <div className="auth">
            <h1>Login</h1>
            <form>
                <input required type="text" placeholder="username" name="username" onChange={handleChange}/>
                <input required type="password" placeholder="password" name="password" onChange={handleChange}/>
                <button onClick={handleSubmit}>Login</button>
                {err && <p>{err}</p>}
                <span>Not registered? <Link to="/Register"> Register</Link> </span>
            </form>
        </div>
    );
}

export default Login;