// pages/trophies.js
import { useState, useEffect } from 'react';
import { subscribeProgress } from '../lib/firebase';

export default function Trophies({ player }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!player) return;
    const unsub = subscribeProgress(player, setData);
    return () => unsub();
  }, [player]);

  if (!player) {
    return <p>Geef in de URL <code>?player=Roel</code> mee.</p>;
  }
  if (!data) {
    return <p>Loading…</p>;
  }
  return (
    <div>
      <h1>{player}’s Trofeeën</h1>
      <ul>
        {Object.entries(data).map(([stadion, info]) => (
          <li key={stadion}>
            {stadion}: {'⭐'.repeat(info.stars)} (
            {new Date(info.timestamp).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

// DIT IS BELANGRIJK: deze functie zorgt voor SSR
export async function getServerSideProps(context) {
  const { player } = context.query;
  return {
    props: { player: player || null }
  };
}