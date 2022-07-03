import React, { useState, useEffect } from 'react';
import Card from './Card'
import CardPanel from './CardPanel'
import './App.css';

function App() {
  /*const cards = [
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
      name: "The Tough Soldier",
      description: "A nation sponsored threat",
      health: 20,
      attack: 4
    },
    {
      name: "The Fast Soldier",
      description: "A nation sponsored threat",
      health: 15,
      attack: 2
    },
    {
      name: "The Unfit Soldier",
      description: "A nation sponsored threat",
      health: 20,
      attack: 1
    }
  ]*/  
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([])
  
  const getCards = () => {
    const controller = new AbortController()
    const signal = controller.signal

    fetch('/api/cards', {signal})
    .then(function(response) {
      return response.json();
    })
    .then(function(cards) {
      setCards(cards)
    })
    .catch(function(err) {
      if (err.name !== 'AbortError')
        throw err;
    });

    return () => {
      controller.abort()
    };
  }

  useEffect(getCards, [])
  
  function newCharacter() {}
  
  return (
    <div className="App">
      <h1>Cards</h1>
      <div className="cardPanelRoot">
        <section className="deck">
          {cards.map(function(character, i) {
            return <Card character={character} key={character.id} selected={selectedCard === i} onClick={() => selectedCard === i ? setSelectedCard(null) : setSelectedCard(i)}/>;
          })}
          <Card character={{name:"New Character", health:"_", attack:"_"}} onClick={() => newCharacter()}/>
        </section>
        
        { (selectedCard != null) ? (
          <section className="cardPanel">
            <CardPanel character={cards[selectedCard]} setHealth={(health) => cards[selectedCard].health = health}/>
          </section>
          ) : null
        }
        </div>
      </div>
      );
    }
    
    export default App;
    