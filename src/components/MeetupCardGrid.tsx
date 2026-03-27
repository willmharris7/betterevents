import { Button, Card, CardContent, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAppStore } from '../store'

const ImageWrapper = styled('div')({
  position: 'relative',
  width: '100%',
  paddingTop: '56.25%', // 16:9
})

const EventImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
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
              <a href="#" onClick={e => { e.preventDefault(); window.ipcRenderer.invoke('open-external', event.href) }} style={{ textDecoration: 'none', color: 'inherit' }}>
                {event.img && <ImageWrapper><EventImage src={event.img} /></ImageWrapper>}
                <p style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{event.title}</p>
              </a>
              {event.time && <p>{event.time}</p>}
              {event.group && <p>{event.group}</p>}
              {event.attendees && <p>Attendees: {event.attendees}</p>}
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
