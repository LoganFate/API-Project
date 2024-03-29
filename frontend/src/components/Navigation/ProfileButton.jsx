import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem'
import LoginFormModal from '../LoginFormModal/LoginFormModal'
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/'); // Navigate to the homepage after logging out
    setShowMenu(false);
  };

  const handleManageSpotsClick = () => {
    navigate('/spots/current'); // Adjust the path to your route
    setShowMenu(false);
  };

  const ulClassName = `profile-dropdown" ${showMenu ? "" : " hidden"}`;

  return (
    <>
      <button onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
           <>
           <li>Hello, {user.firstName}</li>
           <li>{user.email}</li>
           <li>
             <div className="button-container">
               <button onClick={handleManageSpotsClick}>Manage Spots</button>
               <button onClick={logout}>Log Out</button>
             </div>
           </li>
         </>
       ) : (
          <>
   <OpenModalMenuItem
              itemText="Log In"
              onItemClick={() => setShowMenu(false)}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={() => setShowMenu(false)}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
