import { useImmer } from 'use-immer'
import { Button, Card, CardContent, Grid, Divider, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, Typography, Box, Chip } from '@mui/material'
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
    date: '2026-03-28',
    time: '00:00',
    blocklistOpen: false,
    blocklist: { meetupTitles: [] as string[], meetupGroups: [] as string[], eventbriteTitles: [] as string[] }
  })

  async function openBlocklist() {
    const current = await window.ipcRenderer.getBlocklist()
    setState(draft => { draft.blocklist = current; draft.blocklistOpen = true })
  }

  async function removeBlocklistItem(key: 'meetupTitles' | 'meetupGroups' | 'eventbriteTitles', index: number) {
    const updated = { ...state.blocklist, [key]: state.blocklist[key].filter((_, i) => i !== index) }
    await window.ipcRenderer.setBlocklist(updated)
    setState(draft => { draft.blocklist[key] = updated[key] })
  }

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
        <Button variant="outlined" onClick={openBlocklist}>Blocklist</Button>
        <FormControlLabel control={<Checkbox checked={state.checkboxes.meetup} onChange={() => setState(draft => { draft.checkboxes.meetup = !draft.checkboxes.meetup })} />} label="Meetup" />
        <FormControlLabel control={<Checkbox checked={state.checkboxes.eventbrite} onChange={() => setState(draft => { draft.checkboxes.eventbrite = !draft.checkboxes.eventbrite })} />} label="Eventbrite" />
      </Stack>
      <Dialog open={state.blocklistOpen} onClose={() => setState(draft => { draft.blocklistOpen = false })}>
        <DialogTitle>Blocklist</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">Meetup Titles</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {state.blocklist.meetupTitles.map((title, i) => (
              <Chip key={i} label={title} onDelete={() => removeBlocklistItem('meetupTitles', i)} />
            ))}
          </Box>
          <Typography variant="subtitle2">Meetup Groups</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {state.blocklist.meetupGroups.map((group, i) => (
              <Chip key={i} label={group} onDelete={() => removeBlocklistItem('meetupGroups', i)} />
            ))}
          </Box>
          <Typography variant="subtitle2">Eventbrite Titles</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {state.blocklist.eventbriteTitles.map((title, i) => (
              <Chip key={i} label={title} onDelete={() => removeBlocklistItem('eventbriteTitles', i)} />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
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
                  <Button onClick={async () => { 
                    const current = await window.ipcRenderer.getBlocklist(); 
                    window.ipcRenderer.setBlocklist({ ...current, meetupTitles: [...current.meetupTitles, event.title] }) 
                  }}>Block Event By Title</Button>
                  <Button onClick={async () => { 
                    const current = await window.ipcRenderer.getBlocklist(); 
                    window.ipcRenderer.setBlocklist({ ...current, meetupGroups: [...current.meetupGroups, event.group] }) 
                  }}>Block Meetup Group</Button>
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
                <div>
                  <Button onClick={async () => { 
                    const current = await window.ipcRenderer.getBlocklist();
                    window.ipcRenderer.setBlocklist({ ...current, eventbriteTitles: [...current.eventbriteTitles, event.title] }) 
                  }}>Block Event By Title</Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default App
