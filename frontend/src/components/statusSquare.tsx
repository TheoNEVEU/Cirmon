import { useEffect, useState } from 'react';

export default function StatusSquare() {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    fetch('https://testcirmon.onrender.com/test') // remplace par ton URL backend
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setConnected(true);
      })
      .catch(() => {
        setConnected(false)
        console.log("BDD Connectée");
        });
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: '2%',
        left: '1%',
        width: '10px',
        height: '10px',
        borderRadius: '100px',
        backgroundColor: connected ? 'green' : 'red',
        transition: 'background-color 0.5s ease',
      }}
      aria-label={connected ? "Connecté à la base" : "Non connecté à la base"}
    />
  );
}
