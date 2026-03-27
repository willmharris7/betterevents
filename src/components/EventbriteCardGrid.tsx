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

export default function EventbriteCardGrid() {
  const { eventbriteResults } = useAppStore()
  return (
    <Grid container spacing={2}>
      {eventbriteResults.map((event, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              {event.img && <ImageWrapper><EventImage src={event.img} /></ImageWrapper>}
              <p style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{event.title}</p>
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
  )
}
