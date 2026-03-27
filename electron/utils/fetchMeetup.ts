import { ipcMain } from 'electron'
import { getNextDay } from './meetup-utils/getNextDay';
import { getMeetupHTML } from './meetup-utils/getMeetupHTML';
import { parseMeetupHTMLtoCardArray } from './meetup-utils/parseMeetupHTMLtoCardArray';
import { filterMeetupCardData } from './meetup-utils/filterMeetupCardData';

export function registerFetchMeetup() {
  ipcMain.handle('fetchMeetup', async (_event, date: string, filterTime: string) => {
    const nextDay = getNextDay(date)
    const meetupURL = `https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=${date}T03%3A00%3A00-04%3A00&customEndDate=${nextDay}T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles`
    const meetupHTML = await getMeetupHTML(meetupURL)
    const meetupCardData = parseMeetupHTMLtoCardArray(meetupHTML)
    return filterMeetupCardData(meetupCardData, filterTime)
  })
}
