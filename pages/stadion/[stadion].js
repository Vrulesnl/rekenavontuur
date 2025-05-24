import { useRouter } from 'next/router';
import Game from '../../components/Game';

export default function StadionPage() {
  const { stadion, players } = useRouter().query;
  if (!stadion || !players) return <p>Loading…</p>;
  return <Game stadion={stadion} players={players.split(',')} />;
}