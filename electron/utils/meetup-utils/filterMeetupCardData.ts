import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { store, defaultBlocklist } from '../blocklist';
dayjs.extend(customParseFormat);

export function filterMeetupCardData(meetupCardData: { time: string, title: string, group: string, [key: string]: any }[], filterTime: string) {
  const meetupCardDataFilteredTime = meetupCardData.filter(card => {
    // Given time inputs "Sat, Mar 21 · 6:00 PM PDT" and "Monthly · Sat, Mar 21 · 10:00 AM PDT"
    const cardTimeAMPM = card.time.split(' · ').pop()?.split(' PDT')[0] // produces "6:00 PM"
    const cardTimeDDHH = dayjs(cardTimeAMPM, "hh:mm A").format("HH:mm")
    return cardTimeDDHH >= filterTime
  })
  const blocklist = store.get('blocklist', defaultBlocklist)
  const meetupCardDataFilteredBlocklist = meetupCardDataFilteredTime.filter(card =>
    !blocklist.meetupTitles.includes(card.title) && !blocklist.meetupGroups.includes(card.group)
  )
  return meetupCardDataFilteredBlocklist
}
