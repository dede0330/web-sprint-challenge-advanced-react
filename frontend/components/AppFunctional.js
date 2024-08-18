import React, { useState } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  function getXY(index) {
    const x = index % 3 + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMessage(index) {
    const { x, y } = getXY(index);
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    const col = index % 3;
    const row = Math.floor(index / 3);

    switch (direction) {
      case 'left':
        return col > 0 ? index - 1 : index;
      case 'right':
        return col < 2 ? index + 1 : index;
      case 'up':
        return row > 0 ? index - 3 : index;
      case 'down':
        return row < 2 ? index + 3 : index;
      default:
        return index;
    }
  }

  function move(evt) {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    if (nextIndex !== index) {
      setIndex(nextIndex);
      setSteps(steps + 1);
      setMessage('');
    } else {
      setMessage(`You can't go ${direction}`);
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY(index);

    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, steps, x, y })
    })
    .then(response => response.json())
    .then(data => {
      setMessage(data.message);
      if (data.message.startsWith("Ouch:")) {
        setEmail('');
      }
    })
    .catch(error => {
      setMessage('Something went wrong!');
      console.error('Error:', error);
    });
    setEmail('')
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(index)}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? "time" : "times"}</h3>
      </div>
      <div id="grid">
        {
          grid.map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}