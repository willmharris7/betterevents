import { useState } from 'react'
import Button from '@mui/material/Button'
import './App.css'

function App() {
  const [output, setOutput] = useState('unclicked')

  async function handleClick() {
    const html = await window.ipcRenderer.invoke('fetch-example')
    setOutput(html)
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>Hello World!!</Button>
      <div>{output}</div>
    </div>
  )
}

export default App
