import { useState } from "react";
import { signIn, signUp } from "../../services/auth";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../..";

export default function Login() {
    async function login(email: string, password: string, isLogin: boolean) {
        const result = await (isLogin ? signIn(email, password) : signUp(email, password));
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

    const user = useContext(AuthContext);

    if (success || user.user !== null) {
        return (
            <Navigate to="/home"/>
        );
    }
    return (
        <>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="button" onClick={(evt) => {
                evt.preventDefault();
                setIsLoading(true);
                login(email, password, true);
            }}>Login</button>
            <button type="button" onClick={(evt) => {
                evt.preventDefault();
                setIsLoading(true);
                login(email, password, false);
            }}>Sign Up</button>
            {error.code !== "" && <p>{`${error.code}: ${error.message}`}</p>}
            
        </>
    )
}