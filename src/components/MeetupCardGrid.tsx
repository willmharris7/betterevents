import { Button, Card, CardContent, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAppStore } from '../store'

const EventImage = styled('img')({
  width: '375px',
  height: '200px',
  objectFit: 'cover',
})

export default function MeetupCardGrid() {
  const { meetupResults } = useAppStore()
  return (
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
  )
}
