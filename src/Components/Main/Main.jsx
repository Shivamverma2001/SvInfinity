import React, { useContext, useEffect } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../Context/Context';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, isDarkMode } = useContext(Context);
  let recognition;

  const startVoiceRecognition = () => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      alert('Sorry, your browser does not support speech recognition.');
      return;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          setInput(finalTranscript);
        } else {
          interimTranscript += transcript;
        }
      }
      setInput(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setInput(finalTranscript);
      console.log('Voice recognition stopped.');
    };

    recognition.start();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file);
      setInput(`File: ${file.name}`);
    }
  };

  const handleSend = () => {
    if (input) {
      onSent();
    }
  };

  // Handle keydown event
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if inside a form
      handleSend();
    }
  };

  return (
    <div className={`main ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="nav">
        <p>SvInfinity</p>
        <div className="user-icon-container">
          <img src={assets.user_icon} alt="User Icon" className="user-icon" />
        </div>
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
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder='Enter a prompt here'
              onKeyDown={handleKeyDown} // Add keydown event listener
            />
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <img src={assets.gallery_icon} alt="" style={{ cursor: 'pointer' }} />
              </label>
              <img
                src={assets.mic_icon}
                alt=""
                onClick={startVoiceRecognition}
                style={{ cursor: 'pointer' }}
              />
              {input ? <img onClick={handleSend} src={assets.send_icon} alt="" /> : null}
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
