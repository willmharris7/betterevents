import { Stack } from '@mui/material'
import { DatePicker, TimePicker, GetEventsButton, BlocklistButton, WebsiteCheckboxes, BlocklistPopup, MeetupCardGrid, EventbriteCardGrid } from './components'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap justifyContent="center" alignItems="center" sx={{ pt: 5 }}>
          <GetEventsButton />
          <BlocklistButton />
          <DatePicker />
          <TimePicker />
          <WebsiteCheckboxes />
        </Stack>
      </LocalizationProvider>
      <BlocklistPopup />
      <fieldset style={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, margin: '16px 8px', padding: '16px' }}>
        <legend style={{ padding: '0 8px', fontWeight: 'bold', fontSize: '2.2rem', margin: '0 auto' }}>Meetup</legend>
        <MeetupCardGrid />
      </fieldset>
<fieldset style={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, margin: '16px 8px', padding: '16px' }}>
        <legend style={{ padding: '0 8px', fontWeight: 'bold', fontSize: '2.2rem', margin: '0 auto' }}>Eventbrite</legend>
        <EventbriteCardGrid />
      </fieldset>
    </>
  )
}

export default App
