import logo from './logo.svg';
import './App.css';
import ChordDisplay from './components/ChordDisplay';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="Title">Note Trainer by Miguel Padilla</div>
        <img src={logo} className="App-logo" alt="logo" />
        
      </header>
      <ChordDisplay></ChordDisplay>
    </div>
  );
}

export default App;
