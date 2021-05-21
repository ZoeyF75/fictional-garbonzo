import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [scrambled, setScramble] = useState([]);
  const [success, setSuccess] = useState([]);
  const [score, setScore] = useState(0); //overallscore
  const [roundScore, setRoundScore] = useState(0);
  const [correct, setCorrect] = useState(0); //each word
  const [question, setQuestion] = useState(1);
  const [next, setNext] = useState(false);
  const [tab, setTab] = useState(true);

  useEffect(() => {
    getData();
  },[question]);

  const getData = async () => {
    const dataFromServer = await fetchData();
    setData(dataFromServer.data.sentence);
    setScramble(scramble(dataFromServer.data.sentence));
  }

  const fetchData = async () => {
    const res = await fetch(`https://api.hatchways.io/assessment/sentences/${question}`);
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
      setCorrect(prevState => prevState + 1);
    }
    if (guess === answer && guess === " " && correct === w.length) {
      setScore(prevState => prevState + 1); //increase score after line is complete
      setRoundScore(prevState => prevState + 1);
      setCorrect(prevState => prevState * 0);
      setTab(true);
    } else if(answer === " ") {
      setTab(false);
    }
  }

  
  const reload = (e) => {
    setQuestion(prevState => prevState + 1); 
    e.preventDefault();
    setSuccess([]);
    setCorrect(prevState => prevState * 0);
    setNext(false);
    setRoundScore(prevState => prevState * 0);
    getData();
  }

  //function disables tab key, need to run on last key if correct is not equal to word length
  window.onkeydown = function(e) {
    let keycode1 = (e.keyCode ? e.keyCode : e.which);
    if (keycode1 == 0 || keycode1 == 9) {
      if (!tab) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  return (
    <>
    {score === 10 ? <div class="alert alert-success" role="alert">Hooray! You have a score of 10. You won!</div> : null}
    <div className="main-container">
    <span id="scrambled-word">{data.length > 0 ? <h1>{scrambled}</h1>: "Loading..."}</span>
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
    {data.length > 0 ? roundScore === data.split(' ').length  ? 
      <button
        onClick={event => reload(event)}
      >Next
      </button>
      : null : "Loading..."}
    </div>
    </>
  );
}

export default App;
