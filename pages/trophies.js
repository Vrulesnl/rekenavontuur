// pages/trophies.js
import { useState, useEffect } from 'react';
import { subscribeProgress } from '../lib/firebase';

export default function Trophies({ player }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!player) return;
    const unsubscribe = subscribeProgress(player, setData);
    return () => unsubscribe();
  }, [player]);

  if (!player) {
    return <p>Geef in de URL ?player=Naam mee.</p>;
  }
  if (!data) {
    return <p>Loading…</p>;
  }

  return (
    <div>
      <h1>{player}’s Trofeeënkast</h1>
      <ul>
        {Object.entries(data).map(([stadion, info]) => (
          <li key={stadion}>
            {stadion}: {'⭐'.repeat(info.stars)} (laatst: {new Date(info.timestamp).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

// Deze functie draait bij elke request en haalt de 'player' uit de URL
export async function getServerSideProps(context) {
  const { player } = context.query;
  return {
    props: {
      player: player || null
    }
  };
}