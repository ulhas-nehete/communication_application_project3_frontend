import { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
const Nav = () => {

    // when loggedOut User jump to login page
    const isAuthenticated = !!localStorage.getItem('loggedInUser');
    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = '/';
    };
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (<>
        <div className="container">
            <nav className="navbar navbar-expand-sm navbar-light">
                <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavId">
                    <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link {({ isActive }) => (isActive ? 'active' : '')}" to="/chatlist">Group Chat</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link {({ isActive }) => (isActive ? 'active' : '')}" to="/users">Manage Users</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link {({ isActive }) => (isActive ? 'active' : '')}" to="/documentlist">Manage Documents</NavLink>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
        <div className="container">
            <Outlet />
        </div>
    </>
    );
}

export default Nav;