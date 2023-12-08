import React, { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import ChordTrainer from './ChordTrainer';
import './PitchDetectorComponent.css';

const PitchDetectorComponent = () => {
  const [detectedPitch, setDetectedPitch] = useState(null);
  const [clarityPercent, setClarityPercent] = useState(null);
  const audioContextRef = useRef(null);
  const micStreamRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const detectorRef = useRef(null);
  const inputBufferRef = useRef(null);
  const intervalRef = useRef(null);

  const minPitch = 60;
  const maxPitch = 10000;
  const minClarityPercent = 60;
  const refreshInterval = 200;

  useEffect(() => {
    // Start pitch detection updating every refreshInterval ms
    intervalRef.current = setInterval(() => {
      if (!analyserNodeRef.current || !detectorRef.current || !audioContextRef.current || !inputBufferRef.current) return;

      analyserNodeRef.current.getFloatTimeDomainData(inputBufferRef.current);
      const [pitch, clarity] = detectorRef.current.findPitch(inputBufferRef.current, audioContextRef.current.sampleRate);
      
      if (pitch !== null && pitch >= minPitch && pitch <= maxPitch && 100 * clarity >= minClarityPercent) {
        setDetectedPitch(Math.round(pitch * 10) / 10);
        setClarityPercent(Math.round(clarity * 1000) / 10);
      }
    }, refreshInterval);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopMicInput = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null; // Reset the stream reference
      setDetectedPitch(null); // Reset detected pitch 
      setClarityPercent(null); // Reset clarity percent 
    }
  };
  

  const resetAudioContext = async () => {
    // Clear the interval before setting up a new audio context
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    const audioContext = new AudioContext();

    const analyserNode = new AnalyserNode(audioContext, {
      fftSize: 2048,
    });

    audioContextRef.current = audioContext;
    analyserNodeRef.current = analyserNode;

    // Request microphone access and pass it as a stream to the audio context
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStreamRef.current = stream;
    audioContext
      .createMediaStreamSource(micStreamRef.current)
      .connect(analyserNodeRef.current);
    const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
    const inputBuffer = new Float32Array(detector.inputLength);

    detectorRef.current = detector;
    inputBufferRef.current = inputBuffer;

    // Start pitch detection updating every refreshInterval ms
    intervalRef.current = setInterval(() => {
      if (!analyserNodeRef.current || !detectorRef.current || !audioContext.sampleRate || !inputBufferRef.current) return;

      analyserNodeRef.current.getFloatTimeDomainData(inputBufferRef.current);
      //Returns pitch in HZ and clarity which is a measure of confidence... something about wave form matching
      const [pitch, clarity] = detectorRef.current.findPitch(inputBufferRef.current, audioContext.sampleRate);
      
      //ensure detected pitch is within user defined pitch and clarity ranges
      if (pitch !== null && pitch >= minPitch && pitch <= maxPitch && 100 * clarity >= minClarityPercent) {
        setDetectedPitch(Math.round(pitch * 10) / 10);
        setClarityPercent(Math.round(clarity * 1000) / 10);
      }
    }, refreshInterval);
  };
  

  return (
    <div className='pd-display'>
      <ChordTrainer detectedPitch={detectedPitch} />
      {detectedPitch && clarityPercent ? (
        <p>Detected Pitch: {detectedPitch} Hz at {clarityPercent}% clarity</p>
      ) : (
        <p>Waiting for pitch detection...</p>
      )}
      <button onClick={resetAudioContext}>Reset Mic Input</button>
      <button onClick={stopMicInput}>Stop Mic Input</button>
    </div>
  );
};

export default PitchDetectorComponent;