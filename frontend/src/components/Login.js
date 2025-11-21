import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState('');
  const [mode, setMode] = useState('login'); // or signup
  const [msg, setMsg] = useState('');

  const API = process.env.REACT_APP_API_URL || '';

  async function submit(e) {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        await axios.post(`${API}/api/auth/signup`, { 
          organisation_name: org, 
          email, 
          password 
        });
        setMsg('Organisation created. Please login.');
        setMode('login');
        return;
      }

      const r = await axios.post(`${API}/api/auth/login`, { 
        email, 
        password 
      });
      onLogin(r.data.token);

    } catch (err) {
      setMsg(err?.response?.data?.error || 'Error');
    }
  }

  return (
    <div className='container'>
      <h2>{mode === 'login' ? 'Login' : 'Create Organisation'}</h2>
      <form onSubmit={submit} className='row' style={{flexDirection:'column',gap:12}}>
        {mode === 'signup' && (
          <input 
            placeholder='Organisation name' 
            value={org} 
            onChange={e=>setOrg(e.target.value)} 
          />
        )}

        <input 
          placeholder='Email' 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
        />

        <input 
          placeholder='Password' 
          type='password' 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
        />

        <div className='row'>
          <button className='btn-primary' type='submit'>
            {mode==='login' ? 'Login' : 'Create'}
          </button>

          <button type='button' onClick={()=>setMode(mode==='login'?'signup':'login')}>
            {mode==='login' ? 'Create organisation' : 'Back to login'}
          </button>
        </div>

        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}

