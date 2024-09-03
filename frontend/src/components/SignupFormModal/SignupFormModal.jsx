import { useEffect, useState } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setErrors({})
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
      confirmPassword:"Confirm Password field must be the same as the Password field"
    });
  };

  useEffect(() => {
    const errors = {}

    if(email === '' ||
      username === '' ||
      firstName === '' ||
      lastName === '' ||
      password === '' ||
      confirmPassword  === ''||
      username.length < 4 ||
      password.length < 6 ) {errors.field = true}

    setErrors(errors)
  },[setErrors, email, username, firstName, lastName, password, confirmPassword])

  return (
    <>
      
      <form onSubmit={handleSubmit} id='signup-form'>
        <h1 id='title'>Sign Up</h1>
        <label className='signup-form-labels'>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <div>{errors.email && <p className='form-errors'>{errors.email}</p>}</div>
        <label className='signup-form-labels'>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <div>{errors.username && <p className='form-errors'>{errors.username}</p>}</div>
        <label className='signup-form-labels'>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <div>{errors.firstName && <p className='form-errors'>{errors.firstName}</p>}</div>
        <label className='signup-form-labels'>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <div>{errors.lastName && <p className='form-errors'>{errors.lastName}</p>}</div>
        <label className='signup-form-labels'>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div>{errors.password && <p className='form-errors'>{errors.password}</p>}</div>
        <label className='signup-form-labels'>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <div>{errors.confirmPassword && (<p className='form-errors'>{errors.confirmPassword}</p>)}</div>
        <button id='sign-up-button' disabled={errors.field} type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;