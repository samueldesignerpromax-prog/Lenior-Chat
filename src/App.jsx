import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } }} />
      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: '30px', paddingBottom: '60px', minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="*" element={<Chat />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
