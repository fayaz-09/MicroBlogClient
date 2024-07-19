import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"
/*Authcontext used to hold authentication state and user authentication functions.
This allows for rendering different routes and functions on a page based on the users authentication.*/

type Nullable<T> = T | null;

type authContextType = {
    currentUser: Nullable<any>;
    login: (inputs: any) => void;
    logout: (inputs: any) => void;
};

const authContextDefaultValues: authContextType = {
    currentUser: null,
    login: () => {},
    logout: () => {},
};

type Props = {
    children: React.ReactNode;
};

export const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({children} : Props)=>{
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || '{}'));

    const login = async(inputs: any)=>{
        const res = await axios.post("/auth/login", inputs);
        setCurrentUser(res.data);
    };

    const logout = async(inputs : any)=>{
        await axios.post("/auth/logout");
        setCurrentUser(null);
    };

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    const value = {
        currentUser,
        login,
        logout,
    };

    return (
    <AuthContext.Provider value = {value} >
        {children}
    </AuthContext.Provider>
    );
}