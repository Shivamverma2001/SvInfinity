import React, { useState } from 'react';
import Sidebar from './Components/Sidebar/Sidebar';
import Main from './Components/Main/Main';
import Help from './Components/Sidebar/Help/Help';
import './App.css';

const App = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  return (
    <div className='app-container'>
      <Sidebar setShowHelp={setShowHelp} setSelectedPrompt={setSelectedPrompt} />
      {showHelp ? <Help /> : <Main prompt={selectedPrompt} />}
    </div>
  );
}

export default App;
