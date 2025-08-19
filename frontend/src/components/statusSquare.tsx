import { useEffect } from 'react';
import { useConnection } from '../contexts/connectedContext'
import { useApi } from '../contexts/ApiProviderContext';
import '../style/App.css'

export default function StatusSquare() {
  const { status, setStatus } = useConnection();
  const { baseUrl } = useApi();

  useEffect(() => {
    setStatus('connecting');
    fetch(`${baseUrl}/test`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStatus('connected');
        else setStatus('error')
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
