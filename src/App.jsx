import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chat from './pages/Chat';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <Chat />
      <Footer />
    </>
  );
}

export default App;
