import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data);
        }
      });
  };

  const demoLogin = (e) => {
    e.preventDefault()
    return dispatch(sessionActions.login({
      credential: 'Demo-lition',
      password: 'password'
    }))
    .then(closeModal)
  }

  useEffect(() => {
    const errors = {}

    if(credential.length < 4)
      errors.credential = true
    else if(password.length < 6)
      errors.password = true

    setErrors(errors)
  }, [credential, password])

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-box'>
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
        {
        errors.message && (
          <p className='error'>The provided credentials were invalid</p>
        )}
        <button type="submit"  disabled={ errors.credential || errors.password } >Log In</button>
        <button type="submit" onClick={ demoLogin }>Log in as Demo User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;