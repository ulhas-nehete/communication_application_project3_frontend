import { Link } from 'react-router-dom';
const NotFound = () => {
    return (
        <div className="container-small text-center">
            <h1 className='pageHeader'>404 - Page Not Found</h1>
            <Link to="/">Click to return to home page</Link>
        </div>
    );
}
export default NotFound;
