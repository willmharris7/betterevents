import { useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import './App.css'

interface Event {
  href: string
  title: string
  img: string
}

function App() {
  const [output, setOutput] = useState<Event[]>([])
  const [url] = useState('https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=2026-03-21T03%3A00%3A00-04%3A00&customEndDate=2026-03-22T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles')

  async function handleClick() {
    const html = await window.ipcRenderer.invoke('fetch-example', url)
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const events = Array.from(doc.querySelectorAll('a[data-event-label="Event Card"]')).map(a => ({
      href: (a as HTMLAnchorElement).href,
      title: a.querySelector('h3')?.textContent ?? '',
      img: a.querySelector('img')?.src ?? '',
    }))
    setOutput(events)
  }

  return (
    <>
      <Button variant="contained" onClick={handleClick}>Hello World!!</Button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {output.map((event, i) => (
          <Card key={i} sx={{ backgroundColor: 'black', color: 'white', flex: '1 1 300px' }}>
            <CardContent>
              {event.img && <img src={event.img} style={{ width: '350px', height: '200px', objectFit: 'cover' }} />}
              <p>{event.title}</p>
              <a href="#" onClick={e => { e.preventDefault(); window.ipcRenderer.invoke('open-external', event.href) }}>Link</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

export default App
