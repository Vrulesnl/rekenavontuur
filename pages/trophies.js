import { useState, useEffect } from 'react';
import { subscribeProgress } from '../lib/firebase';

export default function Trophies({ query }) {
  const player = query.player;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!player) return;
    const unsub = subscribeProgress(player, setData);
    return () => unsub();
  }, [player]);

  if (!player) return <p>Geef in de URL ?player=Naam mee.</p>;
  if (!data) return <p>Loading…</p>;

  return (
    <div><h1>{player}’s Trofeeënkast</h1><ul>
      {Object.entries(data).map(([stadion, info]) => (
        <li key={stadion}>{stadion}: {'⭐'.repeat(info.stars)} (laatst: {new Date(info.timestamp).toLocaleDateString()})</li>
      ))}
    </ul></div>
); }