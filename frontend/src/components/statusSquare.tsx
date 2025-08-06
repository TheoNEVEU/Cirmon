import { useEffect } from 'react';
import { useConnection } from '../contexts/connectedContext'
import '../style/App.css'

export default function StatusSquare() {
  const { status, setStatus } = useConnection();

  useEffect(() => {
    setStatus('connecting');
    fetch('https://testcirmon.onrender.com/test')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) 
          setStatus('connected');
      })
      .catch(() => {
        setStatus('error')
      });
  }, []);

  return (
    <div id="statusSquare"
      style={{backgroundColor: status == "connected" ? 'green' : status == "connecting" ? 'orange' : 'red'}}
      aria-label={status == "connected" ? "Connecté à la base" : "Non connecté à la base"}
    />
  );
}
