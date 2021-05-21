import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const dataFromServer = await fetchData();
      setData(dataFromServer.data.sentence);
    }
    getData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('https://api.hatchways.io/assessment/sentences/1');
    const data = await res.json();
    return data
  }

  const genIndexOrder = (length) => {
    let order = [];
    while (order.length < length) {
      const index = Math.floor(Math.random() * length);
      if (!order.includes(index)) {
        order.push(index);
      }
    }
    return order;
  }

  const scramble = (sentence) => {
    let scrambledSentence = '';
    sentence = sentence.split(' ');
    sentence.forEach(word => {
      const letterIndex = genIndexOrder(word.length);
      for (let i = 0; i < letterIndex.length; i++) {
        scrambledSentence += word[letterIndex[i]];
      }
      scrambledSentence += " ";
    });
    return scrambledSentence;
  }

  const guess = (guess, answer, i, w) => {
    let key = i + w;
    if (guess.toLowerCase() === answer.toLowerCase()) {
      setSuccess([...success, key]);
    }
    if (guess === answer && guess === " ") {
      setScore(prevState => prevState + 1);
    }
  }

  return (
    <div className="main-container">
    <span id="scrambled-word">{data.length > 0 ? <h1>{scramble(data)}</h1>: "Loading..."}</span>
    <div className="info">Guess the sentence! Start typing</div>
    <div className="info">The yellow blocks are meant for spaces</div>
    <div className="subtext">
      <small>Press Tab to move to the next letter.</small>
      <small>Press SPACE on the yellow keys.</small>
    </div>
  <h2>Score: {score}</h2>
    <div className="keyboard-container">
    {data.length > 0 ? 
      data.split(' ').map(word =>
      <div className="word">
        {word.split('').map((letter, index) => 
          <input 
            key={`${index}${word}`}
            id={success.includes(index + word) ? "success" : "normal"}
            onChange={event => guess(event.target.value, letter, index, word) }
            maxLength="1"
            >
          </input>
        )}
        {<input 
            key={`space${word}`}
            maxLength="1"
            onChange={event => guess(event.target.value, " ", "space", word)}
            id={success.includes(`space${word}`) ? "space-success" : "space"}
          >
          </input>}
      </div> 
     ) : "Loading..."}
    </div>
    </div>
  );
}

export default App;
