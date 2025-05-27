import { useState } from 'react';
import AvatarSelector from '../components/AvatarSelector';
import Link from 'next/link';

const stadions = ['Aanvalia','Verdigia','Tacticia','Counteria'];

export default function Home() {
  const [playerInfo, setPlayerInfo] = useState(null);

  return (
    <div className="landing">
      {!playerInfo ? (
        <AvatarSelector onSelect={setPlayerInfo} />
      ) : (
        <>
          <h1>Welkom, {playerInfo.players.join(' & ')}!</h1>
          <p>Kies je stadion om te beginnen:</p>
          <ul>
            {stadions.map(s => (
                <li key={s}><Link
                  href={{pathname: `/stadion/${s}`,query: {players: playerInfo.players.join(',')}}}
                  legacyBehavior><a>{s}</a></Link></li>
            ))}
          </ul>
        </>
      )}
      <style jsx>{`
        .landing { text-align: center; margin-top: 3rem; }
        ul { list-style: none; padding: 0; }
        li { margin: 0.5rem 0; }
        a { text-decoration: none; padding: 0.5rem 1rem; background: #0070f3; color: white; border-radius: 4px; }
      `}</style>
    </div>
  ); }