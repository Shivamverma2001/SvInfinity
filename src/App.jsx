import React from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import Main from './Components/Main/Main'
import './App.css'

const App = () => {
  return (
    <div className='app-container'>
      <Sidebar/>
      <Main/>
    </div>
  )
}

export default App
