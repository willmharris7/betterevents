import { useImmer } from 'use-immer'
import { Button, Card, CardContent, Grid, Divider, Stack, FormControlLabel, Checkbox } from '@mui/material'
import { styled } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

const EventImage = styled('img')({
  width: '375px',
  height: '200px',
  objectFit: 'cover',
})

interface Event { href: string; title: string; img: string; time: string; group: string; attendees: string; price: string }

function App() {
  const [state, setState] = useImmer({
    meetupResults: [] as Event[],
    eventbriteResults: [] as Event[],
    checkboxes: { meetup: true, eventbrite: true },
    date: '2026-03-21',
    time: ''
  })

  async function getEvents() {
    if (state.checkboxes.meetup) {
      const meetupHtml = await window.ipcRenderer.invoke('fetchMeetup', state.date, state.time)
      const meetupDoc = new DOMParser().parseFromString(meetupHtml, 'text/html')
      const meetupEvents = Array.from(meetupDoc.querySelectorAll('a[data-event-label="Event Card"]')).map(a => ({
        href: (a as HTMLAnchorElement).href,
        title: a.querySelector('h3')?.textContent ?? '',
        img: a.querySelector('img')?.src ?? '',
        time: a.querySelector('time')?.textContent ?? '',
        group: a.querySelector('div.flex-shrink.min-w-0.truncate')?.textContent ?? '',
        attendees: a.querySelector('span.ds2-m14.py-ds2-8')?.textContent ?? '',
        price: ''
      }))
      setState(draft => { draft.meetupResults = meetupEvents })
    }

    if (state.checkboxes.eventbrite) {
      const eventbriteHtml = await window.ipcRenderer.invoke('fetchEventbrite', state.date, state.time)
      const eventbriteDoc = new DOMParser().parseFromString(eventbriteHtml, 'text/html')
      const eventbriteEvents = Array.from(eventbriteDoc.querySelectorAll('div[class="Container_root__4i85v NestedActionContainer_root__1jtfr event-card event-card__horizontal horizontal-event-card__action-visibility"]')).map(div => ({
        href: div.querySelector('a')?.href ?? '',
        title: div.querySelector('h3')?.textContent ?? '',
        img: div.querySelector('img')?.src ?? '',
        time: div.querySelector('p[class="Typography_root__487rx #585163 Typography_body-md__487rx event-card__clamp-line--one Typography_align-match-parent__487rx"]')?.textContent ?? '',
        group: '',
        attendees: '',
        price: div.querySelector('p[style="--TypographyColor: #3a3247;"]')?.textContent ?? ''
      }))
      setState(draft => { draft.eventbriteResults = eventbriteEvents })
    }

    
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2} sx={{ p: 1 }}>
          <DatePicker label="Date" value={dayjs(state.date)} onChange={(value: Dayjs | null) => { if (value) setState(draft => { draft.date = value.format('YYYY-MM-DD') }) }}/>
        </Stack>
      </LocalizationProvider>
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
        {state.eventbriteResults.map((event, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                {event.img && <EventImage src={event.img} />}
                <p>{event.title}</p>
                {event.time && <p>{event.time}</p>}
                {event.price&& <p>{event.price}</p>}
                <a href="#" onClick={e => { e.preventDefault(); window.ipcRenderer.invoke('open-external', event.href) }}>Link</a>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default App
