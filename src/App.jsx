import React, { useState } from 'react';
import axios from 'axios';
import { FaCopy, FaVolumeUp } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [quote, setQuote] = useState('No quotes available');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speechRate, setSpeechRate] = useState(1); // Default speed is 1

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://quotes15.p.rapidapi.com/quotes/random/', {
        headers: {
          'X-RapidAPI-Key': '2e34fe942dmshf8f4d8b1d0bdbffp14baf6jsneb8b07999f3b',
          'X-RapidAPI-Host': 'quotes15.p.rapidapi.com',
        },
      });
      const { content, originator } = response.data;
      setQuote(content);
      setAuthor(originator.name);
      setCopied(false);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${quote}" - ${author}`)
      .then(() => {
        setCopied(true);
        toast.success('Quote copied to clipboard!', { autoClose: 3000 });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error('Error copying quote:', error));
  };

  const speakQuote = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`"${quote}" - ${author}`);
      utterance.rate = speechRate; // Use the selected speech rate
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
      toast.success(`Speaking at speed: ${speechRate.toFixed(1)}x`, { autoClose: 2000 });
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  return (
    <div className="container-fluid text-center d-flex flex-column justify-content-center align-items-center min-vh-100 glamorous-background">
      <h1 className="glamorous-title">Quote Generator</h1>

      <div className="quote-box p-4 mb-4 border-0 rounded shadow-lg glass-morphism">
        {loading ? (
          <div className="spinner-border text-gold" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div>
            <p className="lead text-white">"{quote}"</p>
            <p className="font-weight-bold text-gold">{author ? `- ${author}` : ''}</p>
          </div>
        )}
      </div>

      {/* Speech Rate Slider */}
      <div className="mb-3 speed-slider-container">
        <label htmlFor="speedRange" className="form-label speed-label">
          Playback Speed: <span className="speed-value">{speechRate.toFixed(1)}x</span>
        </label>
        <input
          type="range"
          className="form-range custom-slider"
          id="speedRange"
          min="0.5"
          max="2"
          step="0.1"
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
        />
      </div>

      <div className="d-flex gap-3">
        <button className="btn btn-glamorous glowing-gradient-button" onClick={fetchQuote} title="Get a new quote">
          Get a Quote
        </button>
        <button className="btn btn-glamorous glowing-gradient-button" onClick={copyQuote} disabled={loading || quote === 'No quotes available'} title="Copy to clipboard">
          <FaCopy className="me-2" />
        </button>
        <button className="btn btn-glamorous glowing-gradient-button" onClick={speakQuote} disabled={loading || quote === 'No quotes available'} title="Speak the quote">
          <FaVolumeUp className="speak-icon" />
        </button>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="glamorous-toast"
        progressClassName="glamorous-progress"
      />
    </div>
  );
};

export default App;