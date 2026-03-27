import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { store, defaultBlocklist } from '../blocklist';
dayjs.extend(customParseFormat);

export function filterEventbriteCardData(eventbriteCardData: { time: string, title: string, [key: string]: any }[], filterTime: string) {
  const eventbriteCardDataFilteredTime = eventbriteCardData.filter(card => {
    const cardTimeAMPM = card.time.split('•')[1]
    const cardTimeDDHH = dayjs(cardTimeAMPM, "hh:mm A").format("HH:mm")
    return cardTimeDDHH >= filterTime
  })
  const blocklist = store.get('blocklist', defaultBlocklist)
  const eventbriteCardDataFilteredBlocklist = eventbriteCardDataFilteredTime.filter(card =>
    !blocklist.eventbriteTitles.includes(card.title)
  )
  return eventbriteCardDataFilteredBlocklist
}
