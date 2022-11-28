import React, { useState } from 'react';
import { useAuth } from '../../shared/contexts/AuthContext';

export default function Login({ setShowLoginForm }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = useAuth();

  function signin(email, password) {
    auth.signin(email, password);
    setShowLoginForm(false);
  }

  return (
    <div className='form'>
      <div className="form__group">
        <input type="text" className="form__input" placeholder="Email" id="email" onChange={(v) => setEmail(v.target.value)} required />
        <label htmlFor="email" className="form__label">Email</label>
      </div>

      <div className="form__group">
        <input type="password" className="form__input" placeholder="Password" id="password" onChange={(v) => setPassword(v.target.value)} required />
        <label htmlFor="password" className="form__label">Password</label>
      </div>

      <button className='btn-text' onClick={() => signin(email, password)}>
        Login
      </button>
    </div>
  )
}
