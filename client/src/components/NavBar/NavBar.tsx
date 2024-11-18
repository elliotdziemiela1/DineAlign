import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../..";
import { signOut } from "../../services/auth";

function NavBar() {
    const user = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <>
            <div>
                Hi.
                {!!user.user ? <button type="button" onClick={() => signOut()}>Sign Out</button> : <button type="button" onClick={() => navigate("/login")}>Sign In</button>}
            </div>
            <Outlet/>
        </>
    );
}

export default NavBar;