import logo from './logo.svg';
import styles from './App.module.scss';
import { useEffect } from 'react';

function App() {

  return (
    <div className={styles.App}>
      <header className={styles["App-header"]}>
        <img src={logo} className={styles["App-logo"]} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className={styles["App-link"]}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div onClick={testServer}>Test Server</div>
      </header>
    </div>
  );
}

async function testServer() {
  try {
    //CORS is annoying.. will need to figure out later
    const response = await fetch('http://localhost:5050/api', {
      mode: 'cors',
      method: 'GET'
    })
    const data = await response.json();
    console.log(response, data)
  } catch (e: unknown) {
    console.log(e)
  }
}

export default App;
