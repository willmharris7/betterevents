import { FormControlLabel, Checkbox } from '@mui/material'
import { useAppStore } from '../store'

export default function WebsiteCheckboxes() {
  const { checkboxes, toggleCheckbox } = useAppStore()
  return (
    <>
      <FormControlLabel control={<Checkbox checked={checkboxes.meetup} onChange={() => toggleCheckbox('meetup')} />} label="Meetup" />
      <FormControlLabel control={<Checkbox checked={checkboxes.eventbrite} onChange={() => toggleCheckbox('eventbrite')} />} label="Eventbrite" />
    </>
  )
}
