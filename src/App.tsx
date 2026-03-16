import { useImmer } from 'use-immer'
import { Button, Card, CardContent, Grid, Divider, Stack, FormControlLabel, Checkbox } from '@mui/material'
import { styled } from '@mui/material/styles'

const EventImage = styled('img')({
  width: '350px',
  height: '200px',
  objectFit: 'cover',
})

interface Event { href: string; title: string; img: string; time: string; group: string; attendees: string; price: string }

function App() {
  const [state, setState] = useImmer({
    meetupResults: [] as Event[],
    eventbriteResults: [] as Event[],
    eventbriteTest: "Test output",
    meetupURL: 'https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=2026-03-21T03%3A00%3A00-04%3A00&customEndDate=2026-03-22T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles',
    eventbriteURL: 'https://www.eventbrite.com/d/or--portland/all-events/?page=1&start_date=2026-03-21&end_date=2026-03-21',
    checkboxes: { meetup: true, eventbrite: true },
  })

  async function getEvents() {
    if (state.checkboxes.meetup) {
      const meetupHtml = await window.ipcRenderer.invoke('fetchMeetup', state.meetupURL)
      const doc = new DOMParser().parseFromString(meetupHtml, 'text/html')
      const events = Array.from(doc.querySelectorAll('a[data-event-label="Event Card"]')).map(a => ({
        href: (a as HTMLAnchorElement).href,
        title: a.querySelector('h3')?.textContent ?? '',
        img: a.querySelector('img')?.src ?? '',
        time: a.querySelector('time')?.textContent ?? '',
        group: a.querySelector('div.flex-shrink.min-w-0.truncate')?.textContent ?? '',
        attendees: a.querySelector('span.ds2-m14.py-ds2-8')?.textContent ?? '',
        price: ''
      }))
      setState(draft => { draft.meetupResults = events })
    }

    if (state.checkboxes.eventbrite) {
      const eventbriteHtml = await window.ipcRenderer.invoke('fetchEventbrite', state.eventbriteURL)
      setState(draft => {draft.eventbriteTest = eventbriteHtml})
    }

    
  }

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={getEvents}>Get Events</Button>
        <FormControlLabel control={<Checkbox checked={state.checkboxes.meetup} onChange={() => setState(draft => { draft.checkboxes.meetup = !draft.checkboxes.meetup })} />} label="Meetup" />
        <FormControlLabel control={<Checkbox checked={state.checkboxes.eventbrite} onChange={() => setState(draft => { draft.checkboxes.eventbrite = !draft.checkboxes.eventbrite })} />} label="Eventbrite" />
      </Stack>
      <Divider/>
      <Grid container spacing={2}>
        {state.meetupResults.map((event, i) => (
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
        <div>{state.eventbriteTest}</div>
      </Grid>
    </>
  )
}

export default App
