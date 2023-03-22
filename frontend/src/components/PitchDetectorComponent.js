import React, { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import ChordTrainer from './ChordTrainer';

const PitchDetectorComponent = () => {
  const [detectedPitch, setDetectedPitch] = useState(null);
  const [clarityPercent, setClarityPercent] = useState(null);
  const audioContextRef = useRef(null);
  const micStreamRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const detectorRef = useRef(null);
  const inputBufferRef = useRef(null);
  const minPitch = 60;
  const maxPitch = 10000;
  const minClarityPercent = 95;
  const refreshInterval = 100;

  useEffect(() => {
    let micStream, analyserNode, detector, inputBuffer;
    let sampleRate = null;
    let inputBufferSize = 2048;
    

    async function setupAudioContext() {
      const audioContext = new AudioContext();
      sampleRate = audioContext.sampleRate;

      analyserNode = new AnalyserNode(audioContext, { fftSize: inputBufferSize });
      detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
      inputBuffer = new Float32Array(detector.inputLength);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream = stream;
      audioContext.createMediaStreamSource(micStream).connect(analyserNode);
    }

    function updatePitch() {
      if (!analyserNode || !detector || !sampleRate || !inputBuffer) return;

      analyserNode.getFloatTimeDomainData(inputBuffer);
      //Returns pitch in HZ and clarity which is a measure of confidence... something about wave form matching
      const [pitch, clarity] = detector.findPitch(inputBuffer, sampleRate);
      
      if (pitch !== null && pitch >= minPitch && pitch <= maxPitch && 100 * clarity >= minClarityPercent) {
        setDetectedPitch(Math.round(pitch * 10) / 10);
        setClarityPercent(Math.round(clarity * 1000) / 10);
      }
    }

    function startPitchDetection() {
      setupAudioContext().then(() => {
        setInterval(() => {
          updatePitch();
        }, refreshInterval);
      });
    }

    startPitchDetection();

    return () => {
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [minPitch, maxPitch, minClarityPercent]);

  const resetAudioContext = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    const audioContext = new AudioContext();
    console.log(audioContext.sampleRate)
    //const sampleRate = audioContext.sampleRate;


    const analyserNode = new AnalyserNode(audioContext, {
      fftSize: 2048,
    });

    audioContextRef.current = audioContext;
    analyserNodeRef.current = analyserNode;

    if (micStreamRef.current) {
      audioContext
        .createMediaStreamSource(micStreamRef.current)
        .connect(analyserNodeRef.current);
      const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
      const inputBuffer = new Float32Array(detector.inputLength);

      detectorRef.current = detector;
      inputBufferRef.current = inputBuffer;
    }
  };

  return (
    <div>
      {detectedPitch && clarityPercent ? (
        <p>Detected Pitch: {detectedPitch} Hz at {clarityPercent}% clarity</p>
      ) : (
        <p>Waiting for pitch detection...</p>
      )}
      <button onClick={resetAudioContext}>Reset Audio Context</button>
      <ChordTrainer detectedPitch={detectedPitch} />
    </div>
  );
};

export default PitchDetectorComponent;
