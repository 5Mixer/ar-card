import React, { useState } from 'react';
import Card from './Card'
import './App.css';

function App() {
  const cards = [
    {
      name: "The Doctor",
      description: "Heals where others harm",
      health: 5,
      attack: 0,
      special_abilities: [
        {
          name: "Medical Kit",
          description: "Gives 3 ❤️ to the weakest deployed character"
        }
      ]
    },
    {
      name: "The Diplomat",
      description: "Strives for peace",
      health: 10,
      attack: 2,
      special_abilities: [
        {
          name: "Peaceful Times",
          description: "All 🗡️ attack damage is halved for one round of play"
        }
      ]
    },
    {
      name: "The Soldier",
      description: "A nation sponsored threat",
      health: 15,
      attack: 4
    }
  ]

  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="App">
      <h1>Cards</h1>
      <section className="deck">
        {cards.map(function(character, i) {
          return <Card character={character} key={character.name} selected={selectedCard === character.name} onClick={() => selectedCard === character.name ? setSelectedCard(null) : setSelectedCard(character.name)}/>;
        })}
      </section>
    </div>
  );
}

export default App;
