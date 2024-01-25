import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
    } catch (res) {
      // Assuming the response is not ok, set a general error message
      setError("The provided credentials were invalid");
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    // Set the credential and password to the demo user's details
    const demoCredential = 'demo@user.io';
    const demoPassword = 'password';
    setCredential(demoCredential);
    setPassword(demoPassword);

    // Dispatch the login action with the demo user's credentials
    await dispatch(sessionActions.login({ credential: demoCredential, password: demoPassword }));
    closeModal();
  };



  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
        <button onClick={handleDemoLogin} type="button" className="demo-user-btn">Demo User</button>
      </form>
    </>
  );
}


export default LoginFormModal;
