import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Teams({ token }) {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  useEffect(()=>fetchData(),[]);
  async function fetchData(){ const r = await axios.get('/api/teams', { headers:{ Authorization:'Bearer '+token }}); setList(r.data||[]); }
  async function add(){ await axios.post('/api/teams', { name, description: desc }, { headers:{ Authorization:'Bearer '+token }}); setName(''); setDesc(''); fetchData(); }
  async function remove(id){ await axios.delete('/api/teams/'+id, { headers:{ Authorization:'Bearer '+token }}); fetchData(); }
  return (<div>
    <h3>Teams</h3>
    <div style={{display:'flex',gap:8}}>
      <input placeholder='Team name' value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder='Description' value={desc} onChange={e=>setDesc(e.target.value)} />
      <button className='btn-primary' onClick={add}>Add Team</button>
    </div>
    <table style={{marginTop:12}}>
      <thead><tr><th>Name</th><th>Description</th><th>Members</th><th>Actions</th></tr></thead>
      <tbody>
        {list.map(it=>(<tr key={it.id}><td>{it.name}</td><td>{it.description}</td><td>{it.members_count}</td><td><button onClick={()=>remove(it.id)}>Delete</button></td></tr>))}
      </tbody>
    </table>
  </div>);
}
