import React, { useState, useEffect } from 'react';
import Card from './Card'
import CardPanel from './CardPanel'

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

  const setSelectedModel = (model) => {
    setCards(cards.map(card => {
      if (card.id === selectedCard) {
        return {...card, model}
      }
      return {...card}
    }))
  }

  const setSelectedName = (name) => {
    setCards(cards.map(card => {
      if (card.id === selectedCard) {
        return {...card, name}
      }
      return {...card}
    }))
  }

  useEffect(getCards, [])
  
  function newCharacter() {
    fetch('/api/cards', {method: "POST"})
    .then(function(response) {
      return response.json();
    })
    .then(function(card) {
      setCards([...cards, {id: card.id, name: "", model: null}])
    });
  }
  
  return (
    <div className="dark:bg-neutral-900 bg-neutral-50 subpixel-antialiased">
      <div className="flex">
        <section className="shrink w-full p-8 rounded flex full-row flex-wrap h-screen overflow-auto">
          {cards.map(function(character) {
            return <Card character={character} key={character.id} selected={selectedCard === character.id} onClick={() => selectedCard === character.id ? setSelectedCard(null) : setSelectedCard(character.id)}/>;
          })}
          <Card character={{name:"New Character", health:"_", attack:"_"}} onClick={() => newCharacter()}/>
        </section>
        
        { (selectedCard != null) ? (
          <section className="shrink w-full h-screen overflow-auto">
            <CardPanel
              character={cards.filter((card) => card.id === selectedCard)[0]}
              setModel={setSelectedModel}
              setName={setSelectedName}
            />
          </section>
          ) : null
        }
        </div>
      </div>
      );
    }
    
    export default App;
    