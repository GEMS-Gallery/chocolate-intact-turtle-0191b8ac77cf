import React, { useState } from 'react';
import { backend } from 'declarations/backend';

export default function App() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await backend.greet(name);
    setGreeting(result);
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="submit">Greet</button>
      </form>
      {greeting && <p>{greeting}</p>}
    </div>
  );
}