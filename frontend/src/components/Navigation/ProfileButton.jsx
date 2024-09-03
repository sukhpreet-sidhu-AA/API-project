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
            onButtonClick={() => setShowMenu(!showMenu)}
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </li>
        <li>
          <OpenModalButton
            onButtonClick={() => setShowMenu(!showMenu)}
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </li>
      </>
    )
  } else {
    links = (
      <> 
        <div className='profile-info'>
          <li>Hello, {user.firstName}</li>
        </div>
        <div className='profile-info'>
          <li>{user.email}</li>
        </div>
        <div id='manage-spots'>
          <li id='manage-spots-link'>
            <NavLink onClick={() => setShowMenu(!showMenu)} to='/spots/current'>Manage Spots</NavLink>
          </li>
        </div>
        <li>
          <button className='button' onClick={logout}>Log Out</button>
        </li>
      </>
    )
  }

  return (
    <>
      <button id='profileButton' onClick={toggleMenu}>
        <div id='user-wrapper'>
          <FaUserCircle color='#7c142c' size='20px'/> 
        </div>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {links}
      </ul>
    </>
  );
}

export default ProfileButton;