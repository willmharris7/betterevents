import { Button, Card, CardContent, Grid, Divider, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, Typography, Box, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { DatePicker, TimePicker } from './components'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useAppStore } from './store'

const EventImage = styled('img')({
  width: '375px',
  height: '200px',
  objectFit: 'cover',
})

function App() {
  const {
    meetupResults, eventbriteResults, checkboxes, date, time, blocklistOpen, blocklist,
    setMeetupResults, setEventbriteResults, toggleCheckbox,
    setBlocklistOpen, setBlocklist, removeBlocklistItem,
  } = useAppStore()

  async function openBlocklist() {
    const current = await window.ipcRenderer.getBlocklist()
    setBlocklist(current)
    setBlocklistOpen(true)
  }

  async function handleRemoveBlocklistItem(key: 'meetupTitles' | 'meetupGroups' | 'eventbriteTitles', index: number) {
    removeBlocklistItem(key, index)
    const updated = useAppStore.getState().blocklist
    await window.ipcRenderer.setBlocklist(updated)
  }

  async function getEvents() {
    if (checkboxes.meetup) {
      const meetupFetchResponse = await window.ipcRenderer.invoke('fetchMeetup', date, time)
      setMeetupResults(meetupFetchResponse)
    }
    if (checkboxes.eventbrite) {
      const eventbriteFetchResponse = await window.ipcRenderer.invoke('fetchEventbrite', date, time)
      setEventbriteResults(eventbriteFetchResponse)
    }
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2} sx={{ p: 1 }}>
          <DatePicker />
          <TimePicker />
        </Stack>
      </LocalizationProvider>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={getEvents}>Get Events</Button>
        <Button variant="outlined" onClick={openBlocklist}>Blocklist</Button>
        <FormControlLabel control={<Checkbox checked={checkboxes.meetup} onChange={() => toggleCheckbox('meetup')} />} label="Meetup" />
        <FormControlLabel control={<Checkbox checked={checkboxes.eventbrite} onChange={() => toggleCheckbox('eventbrite')} />} label="Eventbrite" />
      </Stack>
      <Dialog open={blocklistOpen} onClose={() => setBlocklistOpen(false)}>
        <DialogTitle>Blocklist</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">Meetup Titles</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {blocklist.meetupTitles.map((title, i) => (
              <Chip key={i} label={title} onDelete={() => handleRemoveBlocklistItem('meetupTitles', i)} />
            ))}
          </Box>
          <Typography variant="subtitle2">Meetup Groups</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {blocklist.meetupGroups.map((group, i) => (
              <Chip key={i} label={group} onDelete={() => handleRemoveBlocklistItem('meetupGroups', i)} />
            ))}
          </Box>
          <Typography variant="subtitle2">Eventbrite Titles</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {blocklist.eventbriteTitles.map((title, i) => (
              <Chip key={i} label={title} onDelete={() => handleRemoveBlocklistItem('eventbriteTitles', i)} />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
      <Divider/>
      <Grid container spacing={2}>
        {meetupResults.map((event, i) => (
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
                    const current = await window.ipcRenderer.getBlocklist()
                    window.ipcRenderer.setBlocklist({ ...current, meetupTitles: [...current.meetupTitles, event.title] })
                  }}>Block Event By Title</Button>
                  <Button onClick={async () => {
                    const current = await window.ipcRenderer.getBlocklist()
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
        {eventbriteResults.map((event, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                {event.img && <EventImage src={event.img} />}
                <p>{event.title}</p>
                {event.time && <p>{event.time}</p>}
                {event.price && <p>{event.price}</p>}
                <a href="#" onClick={e => { e.preventDefault(); window.ipcRenderer.invoke('open-external', event.href) }}>Link</a>
                <div>
                  <Button onClick={async () => {
                    const current = await window.ipcRenderer.getBlocklist()
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
