import { useState, useEffect } from 'react';

export default function BossBattle({ config, onFinish, audio }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const question = config.questions[index];
  const correct = (() => {
    switch (question.operation) {
      case 'addition':      return question.a + question.b;
      case 'subtraction':   return question.a - question.b;
      case 'multiplication':return question.a * question.b;
      case 'division':      return question.a / question.b;
      default:              return null;
    }
  })();

  useEffect(() => {
    setInput('');
    setFeedback(null);
  }, [index]);

  function handleAnswer(ans) {
    const parsed = parseInt(ans, 10);
    const isCorrect = parsed === correct;
    audio.play(isCorrect ? 'cheer' : 'wrong');
    if (isCorrect) setScore(s => s + 3);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      if (index + 1 < config.questions.length) {
        setIndex(i => i + 1);
      } else {
        onFinish(score + (isCorrect ? 3 : 0));
      }
    }, 600);
  }

  return (
    <div className="boss-battle">
      <h2>Boss Battle – Vraag {index + 1} / {config.questions.length}</h2>
      <p>
        {question.a}{' '}
        {{
          addition: '+',
          subtraction: '−',
          multiplication: '×',
          division: '÷'
        }[question.operation]}{' '}
        {question.b} = ?
      </p>
      <input type="number" value={input} onChange={e => setInput(e.target.value)} disabled={!!feedback}/>
      <button onClick={() => handleAnswer(input)} disabled={!!feedback}>Antwoord</button>
      {feedback && <p className={feedback}>{feedback === 'correct' ? '✅ Goed!' : '❌ Fout!'}</p>}
    </div>
  ); 
}