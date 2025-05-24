import { useState, useEffect } from 'react';
import BossBattle from './BossBattle';
import { saveProgress } from '../lib/firebase';
import AudioManager from './AudioManager';

export default function Game({ stadion, players }) {
  const [config, setConfig] = useState(null);
  const [phase, setPhase] = useState('rounds');
  const [roundIndex, setRoundIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const audio = AudioManager();

  useEffect(() => {
    fetch(`/config/rounds/${stadion}.json`).then(r => r.json()).then(setConfig);
  }, [stadion]);

  useEffect(() => {
    if (!config || phase === 'end') return;
    setTimer(20);
    const id = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(id);
          handleAnswer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [config, qIndex, roundIndex, phase]);

  if (!config) return <p>Loading…</p>;
  if (phase === 'boss') {
    return <BossBattle config={config.bossBattle} audio={audio} onFinish={pts => { setScore(s => s + pts); setPhase('end'); }} />;
  }
  if (phase === 'end') {
    const maxRounds = config.rounds.length * config.rounds[0].questions.length * 3;
    const maxBoss = config.bossBattle.questions.length * 3;
    const stars = Math.ceil((score / (maxRounds + maxBoss)) * 3);
    players.forEach(name => saveProgress(name, stadion, stars));
    return (
      <div className="end-screen">
        <h2>Top gedaan, {players.join(' & ')}!</h2>
        <p>Score: {score}</p>
        <p>Sterren: {'⭐'.repeat(stars)}</p>
        <button onClick={() => window.location.reload()}>Opnieuw spelen</button>
      </div>
    );
  }
  const round = config.rounds[roundIndex];
  const question = round.questions[qIndex];
  const correct = (() => {
    switch (round.operation) {
      case 'addition': return question.a + question.b;
      case 'subtraction': return question.a - question.b;
      case 'multiplication': return question.a * question.b;
      case 'division': return question.a / question.b;
      default: return null;
    }
  })();

  function handleAnswer(ans) {
    const parsed = parseInt(ans, 10);
    const isCorrect = parsed === correct;
    audio.play(isCorrect ? 'cheer' : 'wrong');
    if (isCorrect) {
      const pts = timer > 15 ? 3 : timer > 5 ? 2 : 1;
      setScore(s => s + pts);
    }
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      setInput('');
      if (qIndex + 1 < round.questions.length) setQIndex(q => q + 1);
      else if (roundIndex + 1 < config.rounds.length) { setRoundIndex(r => r + 1); setQIndex(0); }
      else setPhase('boss');
    }, 600);
  }

  return (
    <div className="game-screen">
      <h2>{stadion} – Ronde {roundIndex + 1}</h2>
      <p>Vraag {qIndex + 1} / {round.questions.length}</p>
      <p className="sum">
        {question.a} {{
          addition: '+',
          subtraction: '−',
          multiplication: '×',
          division: '÷'
        }[round.operation]} {question.b} = ?
      </p>
      <input type="number" value={input} onChange={e => setInput(e.target.value)} disabled={!!feedback}/>
      <button onClick={() => handleAnswer(input)} disabled={!!feedback}>Beantwoord</button>
      <div className="info"><span>Timer: {timer}s</span> | <span>Score: {score}</span></div>
      {feedback && <p className={feedback}>{feedback === 'correct' ? '✅ Goed!' : '❌ Fout!'}</p>}
    </div>
  );
}