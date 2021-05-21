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

  const fetchData= async () => {
    const res = await fetch('https://api.hatchways.io/assessment/sentences/1');
    const data = await res.json();
    return data
  }

  return (
    <div id="scrambled-word">
      {data}
    </div>
  );
}

export default App;
