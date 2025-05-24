import { useState } from 'react';

const colors = ['Rood', 'Blauw', 'Groen', 'Geel'];

export default function AvatarSelector({ onSelect }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [duo, setDuo] = useState(false);
  const [color, setColor] = useState(colors[0]);

  function submit() {
    const players = duo
      ? [name1.trim(), name2.trim()]
      : [name1.trim()];
    onSelect({ players, avatar: color, duo });
  }

  return (
    <div className="avatar-selector">
      <label>
        <input
          type="checkbox"
          checked={duo}
          onChange={e => setDuo(e.target.checked)}
        /> Teamplay-modus
      </label>
      <input
        type="text"
        placeholder="Vul je spelernaam in"
        value={name1}
        onChange={e => setName1(e.target.value)}
      />
      {duo && (
        <input
          type="text"
          placeholder="Vul teamgenoot in"
          value={name2}
          onChange={e => setName2(e.target.value)}
        />
      )}
      <select value={color} onChange={e => setColor(e.target.value)}>
        {colors.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button onClick={submit} disabled={!name1.trim() || (duo && !name2.trim())}>
        Kick-off!
      </button>
      <style jsx>{`
        .avatar-selector {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 300px;
          margin: 2rem auto;
        }
        input, select, button {
          padding: 0.5rem;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}