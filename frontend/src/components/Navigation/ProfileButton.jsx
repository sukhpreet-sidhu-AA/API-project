import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Navigation.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate()

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(!showMenu)
    navigate('/')
  };


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  let links;

  if (!user) {
    links = (
      <>
        <li>
          <OpenModalButton 
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </li>
        <li>
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </li>
      </>
    )
  } else {
    links = (
      <> 
        <li>Hello, {user.firstName}</li>
        <li>{user.email}</li>
        <li>
          <NavLink onClick={() => setShowMenu(!showMenu)} to='/spots/current'>Manage Spots</NavLink>
        </li>
        <li>
          <button className='button' onClick={logout}>Log Out</button>
        </li>
      </>
    )
  }

  return (
    <>
      <button id='profileButton' onClick={toggleMenu}>
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {links}
      </ul>
    </>
  );
}

export default ProfileButton;