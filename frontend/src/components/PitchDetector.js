import React, { useState, useEffect } from 'react';
import { YIN } from 'pitchfinder';

const PitchDetector = () => {
  const [pitch, setPitch] = useState(null);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const yin = YIN();
    let analyzer;

    async function getMicrophone() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 2048;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer);

        detectPitch();
      } catch (err) {
        console.error('Error accessing the microphone:', err);
      }
    }

    function detectPitch() {
      const buffer = new Float32Array(analyzer.fftSize);
      analyzer.getFloatTimeDomainData(buffer);
      const detectedPitch = yin(buffer);

      if (detectedPitch && detectedPitch <= 17000) {
        setPitch(detectedPitch.toFixed(2));
      } else {
        setPitch(null);
      }

      requestAnimationFrame(detectPitch);
    }

    getMicrophone();

    return () => {
      if (analyzer) {
        analyzer.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <h1>Microphone Pitch Detector</h1>
      <p>Pitch: {pitch ? `${pitch} Hz` : 'N/A'}</p>
    </div>
  );
};

export default PitchDetector;
