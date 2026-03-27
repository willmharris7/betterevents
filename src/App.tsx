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
      <MeetupCardGrid />
      <EventbriteCardGrid />
    </>
  )
}

export default App
