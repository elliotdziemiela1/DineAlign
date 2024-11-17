import { Outlet } from "react-router-dom";

function NavBar() {
    return (
        <>
            <div>
                Hi.
            </div>
            <Outlet/>
        </>
    );
}

export default NavBar;