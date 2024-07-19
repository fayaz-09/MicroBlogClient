import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";

function Navbar()
{
    const {currentUser, logout} = useContext(AuthContext);
    
    return(
        <div className="Nav">
            <div className="Logo">
                <Link className="link" to="/"><h1>Micro Blog</h1></Link>
            </div>
            <div className="navActions">
                {/*Checks if a user is logged in. If so a logout option will be displayed and a login option will be displayed if not*/}
                <span>{currentUser?.username}</span>
                {currentUser ? (
                    <span className="logHover" onClick={logout}>Logout</span>
                ) : (
                    <Link className="link logHover" to="/login">Login</Link>
                )}
            </div>
            
        </div>
    );
}

export default Navbar;

