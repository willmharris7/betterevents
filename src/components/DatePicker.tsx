import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useAppStore } from '../store'

export default function DatePicker() {
  const { date, setDate } = useAppStore()
  return (
    <MuiDatePicker
      label="Date"
      value={dayjs(date)}
      onChange={(value: Dayjs | null) => setDate(value ? value.format('YYYY-MM-DD') : '')}
    />
  )
}
