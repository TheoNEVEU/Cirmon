import React, { useEffect, useState } from 'react';

export default function StatusSquare() {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    fetch('https://testcirmon.onrender.com/test') // remplace par ton URL backend
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setConnected(true);
      })
      .catch(() => setConnected(false));
  }, []);

  return (
    <div
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: connected ? 'green' : 'red',
        transition: 'background-color 0.5s ease',
        margin: '20px auto',
      }}
      aria-label={connected ? "Connecté à la base" : "Non connecté à la base"}
    />
  );
}
