import { useState } from "react";
import { signIn, signUp } from "../../services/auth";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../..";

export default function Login() {
    async function login(username:string, email: string, password: string, isLogin: boolean) {
        const result = await (isLogin ? signIn(email, password) : signUp(username, email, password));
        if (result.success) {
            setIsLoading(false);
            setSuccess(true);
        } else {
            setError(result.error as {code: string, message: string});
        }
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<{code: string, message: string}>({code: "", message: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [username, setUsername] = useState("")

    const user = useContext(AuthContext);

    if (success || user.user !== null) {
        return (
            <Navigate to="/home"/>
        );
    }
    return (
        <>
            <p>Signup requires email, password, and unique username. Login only requires email and password.</p>
            <input type="email" name="email" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" name="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
            <input type="username" name="username" value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
            <button type="button" onClick={(evt) => {
                evt.preventDefault();
                setIsLoading(true);
                login(username, email, password, true);
            }}>Login</button>
            <button type="button" onClick={(evt) => {
                evt.preventDefault();
                setIsLoading(true);
                login(username, email, password, false);
            }}>Sign Up</button>
            {error.code !== "" && <p>{`${error.code}: ${error.message}`}</p>}
            
        </>
    )
}