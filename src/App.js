// Frontend: App.js

import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './styles.css';

const App = () => {
  const [transcribedText, setTranscribedText] = useState('');
  const [summarizedText, setSummarizedText] = useState('');
  
  const startListening = () => SpeechRecognition.startListening({ continuous: true });

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setTranscribedText(transcript);
  }, [transcript]);



  const summarizeText = async () => {
    try {
      // const response = await fetch('http://localhost:5000/summarize', {
        const response = await fetch("https://speech-to-text-summarization-backend.onrender.com/summarize", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcribedText }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummarizedText(data.summary);
      } else {
        console.error('Failed to summarize text.');
      }
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Speech recognition is not supported in this browser.</div>;
  }

  return (
    <>
      <div className="container">
        <h2> Transcription </h2>
      

        <textarea
          id="transcribedText"
          rows="8"
          cols="80"
          value={transcribedText}
          onChange={(e) => setTranscribedText(e.target.value)}
        ></textarea>

        <div className="buttons">
          <button onClick={startListening}>Start Listening</button>
          <button onClick={() => SpeechRecognition.stopListening()}>Stop Listening</button>
          <button onClick={summarizeText}>Summarize</button>
        </div>

        {summarizedText && (
          <div className="summary">
            <h2>Summary:</h2>
            <p>{summarizedText}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default App;




