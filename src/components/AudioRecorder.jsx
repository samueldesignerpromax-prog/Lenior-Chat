import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AudioRecorder = ({ onSend, disabled }) => {
  const [recording, setRecording] = useState(false);
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission(true);
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        onSend(blob);
        chunks.current = [];
      };

      mediaRecorder.current.start();
      setRecording(true);
      toast.success('Gravando...');
    } catch (error) {
      console.error(error);
      toast.error('Permissão do microfone negada.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      disabled={disabled}
      className={`audio-btn ${recording ? 'recording' : ''}`}
      title={recording ? 'Parar gravação' : 'Gravar áudio'}
    >
      {recording ? <FaStop /> : <FaMicrophone />}
    </button>
  );
};

export default AudioRecorder;
