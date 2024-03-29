import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

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


  if (sessionUser) return <Navigate to="/" replace={true} />;

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
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };
  const renderError = (fieldName) => {
    if (errors[fieldName]) {
      return <p className="error-message">{errors[fieldName]}</p>;
    }
    return null;
  };

  return (
    <div className="signup-modal-container">
      <div className="signup-modal">
        <h1 id='SignUpTitle'>Sign Up</h1>
        <form onSubmit={handleSubmit} className="signup-form">
        {renderError('email')}
  {renderError('username')}
  {renderError('firstName')}
  {renderError('lastName')}
  {renderError('password')}
  {renderError('confirmPassword')}
          <div className="form-field">
            <label>
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {renderError('email')}
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
            </label>
            {renderError('username')}
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
            </label>
            {renderError('firstName')}
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
            </label>
            {renderError('lastName')}
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
            </label>
            {renderError('password')}
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
            </label>
            {renderError('confirmPassword')}
          </div>

          <button type="submit" className="signup-button" disabled={!canSignUp()}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormPage;
