import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { FaFortAwesome } from 'react-icons/fa';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li>
                <ProfileButton user={sessionUser} />
            </li>
        );
    } else {
        sessionLinks = (
            <li>
                <ProfileButton />
            </li>
        );
    }

    return (
        <ul className='navList'>
            <li>
                <NavLink to="/"><FaFortAwesome /> CastleBnB</NavLink>
            </li>
            <div id='nav-list-right'>
            {isLoaded && sessionUser && (
                <li>
                    <NavLink to='/spots/new'>Create a New Spot</NavLink>
                </li>
            )}
            {isLoaded && sessionLinks}
            </div>
        </ul>
    );
}

export default Navigation;