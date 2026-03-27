import { Button } from '@mui/material'
import { useAppStore } from '../store'

export default function GetEventsButton() {
  const { date, time, checkboxes, setMeetupResults, setEventbriteResults } = useAppStore()

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

  return <Button variant="contained" onClick={getEvents}>Get Events</Button>
}
