import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleCreateSpotClick = () => {
    navigate('/spots/new'); // Navigate to the Create Spot form
  };

  const sessionLinks = sessionUser ? (
    <>
      <li>
        <button onClick={handleCreateSpotClick}>Create a New Spot</button> {/* Create Spot button */}
      </li>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    </>
  ) : (
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

  return (
    <div className='nav-links'>
    <nav>
      <ul>
        {/* Logo and other navigation items */}
        {isLoaded && sessionLinks}
      </ul>
    </nav>
    </div>
  );
}

export default Navigation;
