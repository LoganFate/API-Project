import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const canSignUp = () => {
    return (
      email.length > 0 &&
      username.length >= 4 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      password.length >= 6 &&
      confirmPassword.length > 0
    );
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };


  return (
    <div className="signup-modal-container">
      <div className="signup-modal">
        <h1 id='SignUpTitle'>Sign Up</h1>
        <form onSubmit={handleSubmit} className="signup-form">


          <div className="form-field">
            <label>
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </label>
          </div>

          <div className="form-field">
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {errors.username && <p className="error-message">{errors.username}</p>}
            </label>
          </div>

          <div className="form-field">
            <label>
              First Name
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              {errors.firstName && <p className="error-message">{errors.firstName}</p>}
            </label>
          </div>

          <div className="form-field">
            <label>
              Last Name
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              {errors.lastName && <p className="error-message">{errors.lastName}</p>}
            </label>
          </div>

          <div className="form-field">
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </label>
          </div>

          <div className="form-field">
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </label>
          </div>

          <button type="submit" className="signup-button" disabled={!canSignUp()}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;
