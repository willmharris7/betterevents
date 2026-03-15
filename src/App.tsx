import { useState } from 'react'
import Button from '@mui/material/Button'
import './App.css'

function App() {
  const [output, setOutput] = useState('unclicked')

  return (
    <div>
      <Button variant="contained" onClick={() => setOutput('clicked')}>Hello World!!</Button>
      <div>{output}</div>
    </div>
  )
}

export default App
