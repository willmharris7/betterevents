import { useImmer } from 'use-immer'
import { Button, Card, CardContent, Grid, Divider, Stack, FormControlLabel, Checkbox } from '@mui/material'
import { styled } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

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
    time: '00:00'
  })

  async function getEvents() {
    if (state.checkboxes.meetup) {
      const meetupFetchResponse = await window.ipcRenderer.invoke('fetchMeetup', state.date, state.time)
      setState(draft => { draft.meetupResults = meetupFetchResponse })
    }

    if (state.checkboxes.eventbrite) {
      const eventbriteFetchResponse = await window.ipcRenderer.invoke('fetchEventbrite', state.date, state.time)
      setState(draft => { draft.eventbriteResults = eventbriteFetchResponse })
    }
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2} sx={{ p: 1 }}>
          <DatePicker label="Date" value={dayjs(state.date)} onChange={(value: Dayjs | null) => {setState(draft => { draft.date = value ? value.format('YYYY-MM-DD') : '' }) }}/>
          <TimePicker label="Start Time" value={dayjs(state.time, 'HH:mm')} onChange={(value: Dayjs | null) => { setState(draft => { draft.time = value ? value.format('HH:mm') : '' }) }}/>
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
                <div>
                  <Button>Block Event</Button>
                  <Button>Block Group</Button>
                </div>
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
