import { Button } from '@mui/material'
import { useAppStore } from '../store'

export default function GetEventsButton() {
  const { date, time, checkboxes, setMeetupResults, setEventbriteResults, setMeetupLoading, setEventbriteLoading } = useAppStore()

  async function getEvents() {
    if (checkboxes.meetup) setMeetupLoading(true)
    if (checkboxes.eventbrite) setEventbriteLoading(true)

    await Promise.all([
      checkboxes.meetup && window.ipcRenderer.invoke('fetchMeetup', date, time).then((r: any) => { setMeetupResults(r); setMeetupLoading(false) }),
      checkboxes.eventbrite && window.ipcRenderer.invoke('fetchEventbrite', date, time).then((r: any) => { setEventbriteResults(r); setEventbriteLoading(false) }),
    ])
  }

  return <Button variant="contained" onClick={getEvents}>Get Events</Button>
}
