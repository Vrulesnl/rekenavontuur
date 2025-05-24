export default function AudioManager() {
  const sounds = {
    correct: new Audio('/sounds/correct.mp3'),
    wrong:   new Audio('/sounds/wrong.mp3'),
    cheer:   new Audio('/ounds/cheer.mp3')
  };
  function play(key) {
    const s = sounds[key];
    if (s) s.play().catch(() => {});
  }
  return { play };
}