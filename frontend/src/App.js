import logo from './musicicon.png';
import './App.css';
import PitchDetectorComponent from './components/PitchDetectorComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="Title">Miguel Padilla's Note Trainer</div>
        <img src={logo} className="App-logo" alt="logo" />
        
      </header>
      <PitchDetectorComponent/>
    </div>
  );
}

export default App;
