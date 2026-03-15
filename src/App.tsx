import { useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import './App.css'

function App() {
  const [output, setOutput] = useState<string[]>([])
  const [url] = useState('https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=2026-03-21T03%3A00%3A00-04%3A00&customEndDate=2026-03-22T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles')

  async function handleClick() {
    const html = await window.ipcRenderer.invoke('fetch-example', url)
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const hrefs = Array.from(doc.querySelectorAll('a[data-event-label="Event Card"]')).map(a => (a as HTMLAnchorElement).href)
    setOutput(hrefs)
  }

  return (
    <>
      <Button variant="contained" onClick={handleClick}>Hello World!!</Button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {output.map((href, i) => (
          <Card key={i} sx={{ backgroundColor: 'black', color: 'white', flex: '1 1 300px' }}>
            <CardContent>
              <p>Example title</p>
              <a href="#" onClick={e => { e.preventDefault(); window.ipcRenderer.invoke('open-external', href) }}>Link</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

export default App
