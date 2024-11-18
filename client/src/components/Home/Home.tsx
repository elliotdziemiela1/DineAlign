import { useContext } from "react";
import { AuthContext } from "../..";
import { Link } from "react-router-dom";

function Home() {
    const user = useContext(AuthContext);
    console.log("Home:", user);
    return (
        <>
            <div>
                Home!
                Current user is {user?.user?.email}
            </div>
            <Link to={"/profile"}>Profile</Link>
        </>
    );
}

export default Home;