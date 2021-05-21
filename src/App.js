import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]); //actual sentence retrieved
  const [scrambled, setScramble] = useState([]); //sentence scrambled used to display
  const [success, setSuccess] = useState([]); //array of correct guesses
  const [score, setScore] = useState(0); //overallscore
  const [roundScore, setRoundScore] = useState(0); //score for each sentence
  const [correct, setCorrect] = useState(0); //score for each word
  const [question, setQuestion] = useState(1); //used in fetchdata call
  const [tab, setTab] = useState(true); //disable tab when sentence is incomplete

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
    if (guess === answer && guess === " " && correct === w.length) {
      // setScore(prevState => prevState + 1); //increase score after line is complete
      setSuccess([...success, key]);
      setRoundScore(prevState => prevState + 1);
      setCorrect(prevState => prevState * 0);
      setTab(true);
    } else if (guess.toLowerCase() === answer.toLowerCase()) {
      setSuccess([...success, key]);
      setCorrect(prevState => prevState + 1);
    }
    else if(answer === " ") {
      setTab(false);
    }
    if (success.length === data.length) {
      setRoundScore(prevdata => prevdata * 0 + data.split(" ").length);
    }
  }

  const reload = (e) => {
    setQuestion(prevState => prevState + 1); 
    e.preventDefault();
    setSuccess([]);
    setCorrect(prevState => prevState * 0);
    setScore(prevState => prevState + roundScore);
    setRoundScore(prevState => prevState * 0);
    //ensures all input boxes are cleared
    const elements = document.getElementsByTagName("input");
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "text") {
        elements[i].value = "";
      }
    }
    getData();
  }

  //function disables tab key, need to run on last key if correct is not equal to word length
  window.onkeydown = function(e) {
    let keycode1 = (e.keyCode ? e.keyCode : e.which);
    if (keycode1 === 0 || keycode1 === 9) {
      if (!tab) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  return (
    <>
    {score + roundScore >= 10 ? <div className="alert alert-success" role="alert">Hooray! You have a score of 10. You won!</div> : null}
    <div className="main-container">
    <span id="scrambled-word">{data.length > 0 ? <h1>{scrambled}</h1>: "Loading..."}</span>
    <div className="info">Guess the sentence! Start typing</div>
    <div className="info">The yellow blocks are meant for spaces</div>
    <div className="subtext">
      <small>Press Tab to move to the next letter.</small>
      <small>Press SPACE on the yellow keys.</small>
    </div>
  <h2>Score: {roundScore + score}</h2>
    <div className="keyboard-container">
    {data.length > 0 ? 
      data.split(' ').map((word, index) =>
      <div 
        key={index}
        className="word"
      >
        {word.split('').map((letter, index) => 
          <input 
            key={`${index}${word}`}
            className={success.includes(index + word) ? "success" : "normal"}
            onChange={event => guess(event.target.value, letter, index, word) }
            maxLength="1"
            disabled={success.includes(index + word)}
            >
          </input>
        )}
        {<input 
            key={`space${word}`}
            maxLength="1"
            onChange={event => guess(event.target.value, " ", "space", word)}
            className={success.includes(`space${word}`) ? "space-success" : "space"}
            disabled={success.includes(`space${word}`)}
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
