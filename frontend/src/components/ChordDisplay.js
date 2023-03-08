import React, { useState } from 'react';

const ChordDisplay = () => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Define possible interval structures for major and minor chords
  const intervals = { major: [0, 4, 7], minor: [0, 3, 7] };

  // Generate a random root note and interval structure for the chord
  const [rootNote, setRootNote] = useState(notes[Math.floor(Math.random() * notes.length)]);
  const [chordType, setChordType] = useState(Math.random() < 0.5 ? 'major' : 'minor');

  const handleNewChord = () => {
    setRootNote(notes[Math.floor(Math.random() * notes.length)]);
    setChordType(Math.random() < 0.5 ? 'major' : 'minor');
  };

  // Use the root note and interval structure to generate the notes in the chord
  const chordNotes = intervals[chordType].map(interval => {
    const noteIndex = (notes.indexOf(rootNote) + interval) % notes.length;
    return notes[noteIndex];
  });

  // Define the name of the chord based on the root note and chosen interval struct
  const chordName = `${rootNote}${chordType === 'major' ? '' : 'm'}`; // Add 'm' suffix for minor chords

  return (
    <div>
      <h1 className='Chord-name'>{chordName}</h1>
      <div>{chordNotes.map((note, index) => (
        <span key={index} style={{border: '1px solid black', padding: '0.5em', margin: '0.5em', width: '2em', height: '2em', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>{note}</span>
      ))}</div>
      <button onClick={handleNewChord}>New Chord</button>
    </div>
  );
};

export default ChordDisplay;


