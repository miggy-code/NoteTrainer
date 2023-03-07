import React, { useState } from 'react';

const ChordDisplay = () => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Define possible interval structures for major and minor chords
  const majorIntervalStructure = [0, 4, 7]; // Root note, major third, perfect fifth
  const minorIntervalStructure = [0, 3, 7]; // Root note, minor third, perfect fifth

  // Generate a random root note and interval structure for the chord
  const [rootNote, setRootNote] = useState(Math.floor(Math.random() * 12));
  const [intervalStructure, setIntervalStructure] = useState(majorIntervalStructure);

  const handleNewChord = () => {
    setRootNote(Math.floor(Math.random() * 12));
    setIntervalStructure(Math.random() < 0.5 ? majorIntervalStructure : minorIntervalStructure);
  };

  // Use the root note and interval structure to generate the notes in the chord
  const chordNotes = intervalStructure.map(interval => notes[(rootNote + interval) % 12]);

  // Define the name of the chord based on the root note and interval structure
  const chordName = notes[rootNote] + (intervalStructure === majorIntervalStructure ? '' : 'm'); // Add 'm' suffix for minor chords

  return (
    <div>
      <h2>{chordName}</h2>
      <p>{chordNotes.join(' ')}</p>
      <button onClick={handleNewChord}>New Chord</button>
    </div>
  );
};

export default ChordDisplay;

