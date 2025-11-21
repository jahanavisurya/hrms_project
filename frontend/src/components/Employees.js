import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Employees({ token }) {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [assignEmployee, setAssignEmployee] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(()=>{ fetchData(); fetchTeams(); }, []);
  async function fetchData(){ const r = await axios.get('/api/employees', { headers:{ Authorization:'Bearer '+token }}); setList(r.data||[]); }
  async function fetchTeams(){ const r = await axios.get('/api/teams', { headers:{ Authorization:'Bearer '+token }}); setTeams(r.data||[]); }
  async function add(){ await axios.post('/api/employees', { name, email, role }, { headers:{ Authorization:'Bearer '+token }}); setName(''); setEmail(''); setRole(''); fetchData(); }
  async function remove(id){ await axios.delete('/api/employees/'+id, { headers:{ Authorization:'Bearer '+token }}); fetchData(); }
  async function assign(){ await axios.post('/api/employees/assign', { employeeId: assignEmployee, teamIds: selectedTeams }, { headers:{ Authorization:'Bearer '+token }}); setAssignEmployee(null); setSelectedTeams([]); fetchData(); }

  return (<div>
    <h3>Employees</h3>
    <div style={{display:'flex',gap:8}}>
      <input placeholder='Name' value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder='Role' value={role} onChange={e=>setRole(e.target.value)} />
      <button className='btn-primary' onClick={add}>Add</button>
    </div>
    <table style={{marginTop:12}}>
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
      <tbody>
        {list.map(it=>(<tr key={it.id}><td>{it.name}</td><td>{it.email}</td><td>{it.role}</td><td><button onClick={()=>{ setAssignEmployee(it.id); }}>Assign</button> <button onClick={()=>remove(it.id)}>Delete</button></td></tr>))}
      </tbody>
    </table>
    {assignEmployee && (<div style={{marginTop:12}}>
      <h4>Assign employee to teams</h4>
      <select multiple value={selectedTeams} onChange={e=> setSelectedTeams(Array.from(e.target.selectedOptions, o=>o.value)) } style={{minWidth:240, minHeight:100}}>
        {teams.map(t=>(<option key={t.id} value={t.id}>{t.name}</option>))}
      </select>
      <div><button className='btn-primary' onClick={assign}>Assign</button> <button onClick={()=>setAssignEmployee(null)}>Cancel</button></div>
    </div>)}
  </div>);
}
