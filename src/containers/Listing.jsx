import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Card from '../components/Card'
import CardButton from '../components/CardButton'
import CardPanel from '../components/CardPanel'

export default function Listing() {
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

  const removeCard = (id) => {
    setCards(cards.filter(card => {
      return card.id !== id;
    }));
    setSelectedCard(null);
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
    <div className="dark:bg-neutral-900 bg-neutral-50 subpixel-antialiased h-screen">
      <div className="flex">
        <section className="w-full p-8 rounded flex flex-wrap overflow-auto justify-items-stretch content-start">
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
              removeCard={removeCard}
            />
          </section>
          ) : null
        }
        </div>
      </div>
      );
    }