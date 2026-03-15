import { useState } from 'react'
import Button from '@mui/material/Button'
import './App.css'

function App() {
  const [output, setOutput] = useState('unclicked')
  const [url] = useState('https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=2026-03-21T03%3A00%3A00-04%3A00&customEndDate=2026-03-22T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles')

  async function handleClick() {
    const html = await window.ipcRenderer.invoke('fetch-example', url)
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
