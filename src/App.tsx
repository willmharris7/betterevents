import { useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'

const EventImage = styled('img')({
  width: '350px',
  height: '200px',
  objectFit: 'cover',
})

interface Event {
  href: string
  title: string
  img: string
  time: string
  group: string
  attendees: string
}

function App() {
  const [output, setOutput] = useState<Event[]>([])
  const [url] = useState('https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=2026-03-21T03%3A00%3A00-04%3A00&customEndDate=2026-03-22T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles')
  const [meetupChecked, setMeetupChecked] = useState(true)
  const [eventbriteChecked, setEvenbriteChecked] = useState(true)

  async function getEvents() {
    if (!meetupChecked) return
    const html = await window.ipcRenderer.invoke('fetch-example', url)
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const events = Array.from(doc.querySelectorAll('a[data-event-label="Event Card"]')).map(a => ({
      href: (a as HTMLAnchorElement).href,
      title: a.querySelector('h3')?.textContent ?? '',
      img: a.querySelector('img')?.src ?? '',
      time: a.querySelector('time')?.textContent ?? '',
      group: a.querySelector('div.flex-shrink.min-w-0.truncate')?.textContent ?? '',
      attendees: a.querySelector('span.ds2-m14.py-ds2-8')?.textContent ?? '',
    }))
    setOutput(events)
  }

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={getEvents}>Get Events</Button>
        <FormControlLabel control={<Checkbox checked={meetupChecked} onChange={() => setMeetupChecked(v => !v)} />} label="Meetup" />
        <FormControlLabel control={<Checkbox checked={eventbriteChecked} onChange={() => setEvenbriteChecked(v => !v)} />} label="Eventbrite" />
      </Stack>
      <Divider/>
      <Grid container spacing={2}>
        {output.map((event, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                {event.img && <EventImage src={event.img} />}
                <p>{event.title}</p>
                {event.time && <p>{event.time}</p>}
                {event.group && <p>{event.group}</p>}
                {event.attendees && <p>Attendees: {event.attendees}</p>}
                <a href="#" onClick={e => { e.preventDefault(); window.ipcRenderer.invoke('open-external', event.href) }}>Link</a>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider/>
      <Grid container spacing={2}>

      </Grid>
    </>
  )
}

export default App
