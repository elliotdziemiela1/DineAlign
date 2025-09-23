import { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../..";
import { signOut } from "../../services/auth";
import styles from './NavBar.module.scss';

function NavBar() {
    const user = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <>
            <div className={styles.navbar}>
                <p className={styles.logo} onClick={() => navigate("/home")}>nginx.conf not loading?</p>
                <div className={styles.sbar}>
                    <input type="text" placeholder="Search.." className={styles.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                    <div className={styles.searchbutton}>
                        <Link to={searchQuery ? `/searchUsers/${searchQuery}` : "#"} className={styles.navLink}>Search Users</Link>
                        <Link to={searchQuery ? `/searchDiets/${searchQuery}` : "#"} className={styles.navLink}>Search Diets</Link>
                    </div>
                </div>
                <Link to={"/editor"} className={styles.navLink}>Create Diet</Link>
                <Link to={"/profile"} className={styles.profile}>Profile</Link>
                {!!user.user ? <button type="button" onClick={() => {signOut(); window.location.reload();}} className={styles.login}>Sign Out</button> : 
                                <button type="button" onClick={() => navigate("/login")} className={styles.login}>Sign In</button>}
            </div>
            <Outlet/>
        </>
    );
}

export default NavBar;