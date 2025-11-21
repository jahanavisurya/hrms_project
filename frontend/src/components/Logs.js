import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Logs({ token }) {
  const [logs, setLogs] = useState([]);

  // Backend URL (Render)
  const API = process.env.REACT_APP_API_URL || "";

  async function loadLogs() {
    const r = await axios.get(`${API}/api/logs`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    setLogs(r.data || []);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div>
      <h3>Audit Logs</h3>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{new Date(l.created_at).toLocaleString()}</td>
              <td>{l.user_id}</td>
              <td>{l.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

