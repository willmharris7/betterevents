import { Button, Card, CardContent, Grid, Divider, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { DatePicker, TimePicker, GetEventsButton, BlocklistButton, WebsiteCheckboxes, BlocklistPopup } from './components'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useAppStore } from './store'

const EventImage = styled('img')({
  width: '375px',
  height: '200px',
  objectFit: 'cover',
})

function App() {
  const { meetupResults, eventbriteResults } = useAppStore()

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2} sx={{ p: 1 }}>
          <DatePicker />
          <TimePicker />
        </Stack>
      </LocalizationProvider>
      <Stack direction="row" spacing={2}>
        <GetEventsButton />
        <BlocklistButton />
        <WebsiteCheckboxes />
      </Stack>
      <BlocklistPopup />
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
