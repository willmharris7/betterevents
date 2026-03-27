import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useAppStore } from '../store'
dayjs.extend(customParseFormat)

export default function TimePicker() {
  const { time, setTime } = useAppStore()
  return (
    <MuiTimePicker
      label="Start Time"
      value={dayjs(time, 'HH:mm')}
      onChange={(value: Dayjs | null) => setTime(value ? value.format('HH:mm') : '')}
    />
  )
}
