import React, { useState } from 'react';
import Employees from './Employees';
import Teams from './Teams';
import Logs from './Logs';

export default function Dashboard({ token, onLogout }) {
  const [tab, setTab] = useState('employees');
  return (<div className='container'>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <h2>HRMS Dashboard</h2>
      <div>
        <button onClick={onLogout} className='btn-danger'>Logout</button>
      </div>
    </div>
    <div style={{marginTop:12, display:'flex', gap:8}}>
      <button onClick={()=>setTab('employees')} className='btn-primary'>Employees</button>
      <button onClick={()=>setTab('teams')} className='btn-primary'>Teams</button>
      <button onClick={()=>setTab('logs')} className='btn-primary'>Logs</button>
    </div>
    <div style={{marginTop:16}}>
      {tab==='employees' && <Employees token={token} />}
      {tab==='teams' && <Teams token={token} />}
      {tab==='logs' && <Logs token={token} />}
    </div>
  </div>);
}
