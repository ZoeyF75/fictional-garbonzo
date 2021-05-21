import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);

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

  return (
    <div id="scrambled-word">
      {data.length > 0 ? scramble(data): "Loading..."}
    </div>
  );
}

export default App;
