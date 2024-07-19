import React, { ButtonHTMLAttributes, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register()
{
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [err,setError] = useState(null);

    const navigate = useNavigate();

    /*Function for handling changes on the form for user data.*/
    const handleChange = (e: React.ChangeEvent<any>) =>{
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async(e: React.ChangeEvent<any>) => {
        e.preventDefault()

        try{
            await axios.post("/auth/register", inputs);
            navigate("/login");
        }catch(err: any){
            setError(err.response.data);
        }
    };
    
    return(
        <div className="auth">
            <h1>Register</h1>
            <form>
                <input required type="text" placeholder="username" name="username" onChange={handleChange}/>
                <input required type="email" placeholder="email" name="email" onChange={handleChange}/>
                <input required type="password" placeholder="password" name="password" onChange={handleChange}/>
                <button onClick={handleSubmit}>Register</button>
                {err && <p>{err}</p>}
                <span>Have an account? <Link to="/login"> Login</Link> </span>
            </form>
        </div>
    );
}

export default Register;