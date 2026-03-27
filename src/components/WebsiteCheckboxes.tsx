import { FormControlLabel, Checkbox, Box } from '@mui/material'
import { useAppStore } from '../store'

export default function WebsiteCheckboxes() {
  const { checkboxes, toggleCheckbox } = useAppStore()
  return (
    <Box sx={{ whiteSpace: 'nowrap' }}>
      <FormControlLabel control={<Checkbox checked={checkboxes.meetup} onChange={() => toggleCheckbox('meetup')} />} label="Meetup" />
      <FormControlLabel control={<Checkbox checked={checkboxes.eventbrite} onChange={() => toggleCheckbox('eventbrite')} />} label="Eventbrite" />
    </Box>
  )
}
