import React, { useState, useEffect } from 'react';
import './ChordTrainer.css';

const notes = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

/*Define possible interval structures 
*key - chord name
*value - interval structure
*
*
*
 'dim':[0,3,6],
 'aug':[0,4,8],
*/
const chordTypes = {
  'major': [0, 4, 7],
  'minor': [0, 3, 7],
};

class Chord {
  //pass in notes and rootNote, notes and name are emergent from passed props.
  constructor(rootNote, type, intervals) {
    this.rootNote = rootNote;
    this.type = type;


    this.shortName = rootNote + (type === 'major' ? '' : 'm');
    this.fullName = rootNote + ' ' + type;
    // Use the root note and interval structure to generate the notes in the chord
    this.notes = intervals.map((interval) => {
      const noteIndex = (notes.indexOf(rootNote) + interval) % notes.length;
      return notes[noteIndex];
    });
  }

  static getRandom(notes, chordTypes) {
    const randomIndex = Math.floor(Math.random() * Object.keys(chordTypes).length);
    const [chordType, intervals] = Object.entries(chordTypes)[randomIndex];
    const rootNote = notes[Math.floor(Math.random() * notes.length)];
    
    return new Chord(rootNote, chordType, intervals);
  }
  

  toString() {
    return this.rootNote + this.type;
  }
}





/*
function getRandomChord() {
  const rootIndex = Math.floor(Math.random() * notes.length);
  const rootNote = notes[rootIndex];
  const structure = Math.random() < 0.5 ? 'major' : 'minor';
  const chordTypes = chordStructures[structure];
  const chordNotes = chordTypes.map(
    (interval) => notes[(rootIndex + interval) % notes.length]
  );

  return {
    name: rootNote + (structure === 'major' ? '' : 'm'),
    notes: chordNotes,
  };
}*/


//Algorithm to find MIDI note number from any frequency
function frequencyToNoteNumber(frequency) {
  const noteNumber = 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
  //noteNumber.toFixed(precision (1 or 2 ));
  return Math.round(noteNumber);
}

//Convert note number to note name (preserves octave data)
function noteNumberToNoteName(noteNumber) {
  const octave = Math.floor(noteNumber / 12) - 1;
  const noteIndex = noteNumber % 12;
  return notes[noteIndex] + octave;
}

//Wrapper function for above two chords
function detectNote(pitch) {
  const noteNumber = frequencyToNoteNumber(pitch);
  const note = noteNumberToNoteName(noteNumber);
  return note.slice(0, -1); // Removes octave information
  //TODO: add octave info
}

function ChordTrainer({ detectedPitch }) {
  const [chord, setChord] = useState(Chord.getRandom(notes, chordTypes));
  const [trainingIndex, setTrainingIndex] = useState(-1);
  const [detectedNote, setDetectedNote] = useState(null);
  //todo: set notes and intervals for premium functionality

  
  useEffect(() => {
    if (detectedPitch) {
      const note = detectNote(detectedPitch);
      setDetectedNote(note);

      const chordNotes = chord.notes;

      if (trainingIndex !== -1) {
        if (note === chordNotes[trainingIndex]) {
          setTrainingIndex((prevIndex) => prevIndex + 1);
          if (trainingIndex === chordNotes.length - 1) {
            setChord(Chord.getRandom(notes, chordTypes));
            setTrainingIndex(0);
          }
        }
      }
    } else {
      setDetectedNote(null);
    }

  }, [detectedPitch, chord.notes, trainingIndex]);

  const getBackgroundColor = (index, trainingIndex) => {
    if (index === trainingIndex) {
      return '#F18F01';
    } else if (index < trainingIndex) {
      return '#99C24D';
    } else {
      return 'transparent';
    }
  };

  const handleNewChord = () => {
    setChord(Chord.getRandom(notes, chordTypes));
    setTrainingIndex(-1);
  };

  const startNoteTraining = () => {
    setTrainingIndex(0);
  };



  return (
    <div className='chord-trainer'>
      <div style={{ 
        backgroundColor: '#343A40', 
        borderRadius: '0 0 10% 10%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0',
        minHeight: '15rem',
        }}>
        <div className='chord-display'>
          <div className='chord-info'>
            <h1 className='chord-type'>{chord.shortName}</h1>
            <h2 className='chord-fullname'>{chord.fullName}</h2>
          </div>
        </div>
        <div className='notes-container'>
          {chord.notes.map((note, index) => (
            <div
              key={note}
              className='note-box'
              style={{
                backgroundColor: getBackgroundColor(index, trainingIndex),
              }}
            >
              {note}
            </div>
          ))}
        </div>
        <div className='button-container'>
          <button onClick={handleNewChord}>New Chord</button>
          <button onClick={startNoteTraining}>Note Training</button>
        </div>
      </div>       
      
      <div className='detected-note'>
        Detected Note: {detectedNote || 'N/A'}
      </div>
    </div>
  );



}

export default ChordTrainer;
