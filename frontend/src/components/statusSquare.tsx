import { useEffect } from 'react';
import { useConnection } from '../contexts/connectedContext'
import '../style/App.css'

export default function StatusSquare() {
  const { isConnected, setIsConnected } = useConnection();

  useEffect(() => {
    fetch('https://testcirmon.onrender.com/test')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) 
        setIsConnected(true);
      })
      .catch(() => {
        setIsConnected(false)
      });
  }, []);

  return (
    <div id="statusSquare"
      style={{backgroundColor: isConnected ? 'green' : 'red'}}
      aria-label={isConnected ? "Connecté à la base" : "Non connecté à la base"}
    />
  );
}
