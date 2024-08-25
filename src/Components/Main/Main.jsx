import React, { useContext } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../Context/Context';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
  let recognition; // Declare recognition variable in the component scope

  // Function to start voice recognition
  const startVoiceRecognition = () => {
    // Check if SpeechRecognition is supported
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      alert('Sorry, your browser does not support speech recognition.');
      return; // Exit the function if not supported
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false; // Stop recognizing after a single utterance
    recognition.interimResults = true; // Allow interim results
    recognition.lang = 'en-US'; // Set language to English

    // Variable to store the recognized text
    let finalTranscript = '';

    // Event for when results are returned
    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript; // Get the recognized text
        if (event.results[i].isFinal) {
          finalTranscript += transcript; // Append final results
          setInput(finalTranscript); // Update the input state with the final recognized text
        } else {
          interimTranscript += transcript; // Concatenate interim results
        }
      }
      setInput(finalTranscript + interimTranscript); // Update input with both final and interim results
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      // Stop the microphone and keep the last recognized text in the input field
      setInput(finalTranscript); // Ensure the last final result is kept
      console.log('Voice recognition stopped.'); // Optional: log when recognition stops
    };

    recognition.start(); // Start the voice recognition
  };

  return (
    <div className='main'>
      <div className="nav">
        <p>SvInfinity</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {!showResult
          ? <>
            <div className="greet">
              <p><span>Hello, Dev.</span></p>
              <p>How may I help you today?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Improve the readability of the following code.</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
          : <div className="result">
              <div className="result-title">
                <img src={assets.user_icon} alt="" />
                <p>{recentPrompt}</p>
              </div>
              <div className="result-data">
                <img src={assets.gemini_icon} alt="" />
                {
                  loading
                    ? <div className="loader">
                        <hr />
                        <hr />
                        <hr />
                      </div>
                    : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                }
              </div>
            </div>
        }

        <div className="main-bottom">
          <div className="search-box">
            <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img 
                src={assets.mic_icon} 
                alt="" 
                onClick={startVoiceRecognition} // Start voice recognition on click
                style={{ cursor: 'pointer' }} // Change cursor to pointer for better UX
              />
              {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
            </div>
          </div>
          <p className="bottom-info">
            SvInfinity may display inaccurate info, including about people, so double check its responses. Your privacy and SvInfinity Apps
          </p>
        </div>
      </div>
    </div>
  );
}

export default Main;
