import React from 'react';
import { FaBrain, FaMicrophone } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav style={{
      background: 'rgba(13,13,13,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #333',
      padding: '14px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 999,
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.6rem', fontWeight: 'bold', color: '#d4af37' }}>
          <FaBrain /> Lenior
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '0.9rem' }}>
          <FaMicrophone /> IA Assistente
        </div>
      </div>
    </nav>
  );
}
