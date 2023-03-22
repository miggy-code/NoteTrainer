import logo from './logo.svg';
import './App.css';
import ChordTrainer from './components/ChordTrainer';
import PitchDetectorComponent from './components/PitchDetectorComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="Title">Note Trainer by Miguel Padilla</div>
        <img src={logo} className="App-logo" alt="logo" />
        
      </header>
      <PitchDetectorComponent/>
    </div>
  );
}

export default App;
