import { Divider, Stack } from '@mui/material'
import { DatePicker, TimePicker, GetEventsButton, BlocklistButton, WebsiteCheckboxes, BlocklistPopup, MeetupCardGrid, EventbriteCardGrid } from './components'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
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
      <MeetupCardGrid />
      <Divider/>
      <EventbriteCardGrid />
    </>
  )
}

export default App
