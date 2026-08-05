import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStop, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AudioRecorder({ onAudioSend, disabled }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      toast.success('🎤 Gravando...');
    } catch (err) {
      toast.error('Permissão de microfone negada');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendAudio = async () => {
    if (!audioURL) return;
    setLoading(true);
    try {
      const blob = await fetch(audioURL).then(r => r.blob());
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      // Sessão opcional – pode ser gerada automaticamente pela API
      const sessionId = localStorage.getItem('lenior_session') || undefined;
      if (sessionId) formData.append('sessao_id', sessionId);

      await onAudioSend(formData);
      setAudioURL(null);
    } catch (err) {
      toast.error('Erro ao enviar áudio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {!recording && !audioURL && (
        <button
          className="btn-primary"
          onClick={startRecording}
          disabled={disabled || loading}
          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FaMicrophone /> Gravar Áudio
        </button>
      )}
      {recording && (
        <button
          className="btn-secondary"
          onClick={stopRecording}
          style={{ padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FaStop /> Parar
        </button>
      )}
      {audioURL && !recording && (
        <>
          <audio controls src={audioURL} style={{ height: '40px', maxWidth: '200px' }} />
          <button
            className="btn-primary"
            onClick={sendAudio}
            disabled={disabled || loading}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FaUpload /> Enviar Áudio
          </button>
          <button
            className="btn-secondary"
            onClick={() => setAudioURL(null)}
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #888', color: '#888', borderRadius: '30px' }}
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  );
}
