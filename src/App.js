import React, { useState, useEffect } from 'react';
import Card from './Card'
import CardButton from './CardButton'
import CardPanel from './CardPanel'

function App() {
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

  const setSelectedName = (name) => {
    setCards(cards.map(card => {
      if (card.id === selectedCard) {
        return {...card, name}
      }
      return {...card}
    }))
  }
  
  function newCharacter() {
    fetch('/api/cards', {method: "POST"})
    .then(function(response) {
      return response.json();
    })
    .then(function(card) {
      setCards([...cards, {id: card.id, name: ""}])
    });
  }
  
  return (
    <div className="dark:bg-neutral-900 bg-neutral-50 subpixel-antialiased">
      <div className="flex">
        <section className="shrink w-full p-8 rounded flex full-row flex-wrap h-screen overflow-auto">
          {cards.map(function(character) {
            return <Card character={character} key={character.id} selected={selectedCard === character.id} onClick={() => selectedCard === character.id ? setSelectedCard(null) : setSelectedCard(character.id)}/>;
          })}
          <CardButton onClick={() => newCharacter()}/>
        </section>
        
        { (selectedCard != null) ? (
          <section className="shrink w-full h-screen overflow-auto">
            <CardPanel
              character={cards.filter((card) => card.id === selectedCard)[0]}
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
    