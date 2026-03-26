import { ipcMain, BrowserWindow } from 'electron'
import * as cheerio from 'cheerio'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { store, defaultBlocklist } from './blocklist';
dayjs.extend(customParseFormat);

export function registerFetchMeetup() {
  ipcMain.handle('fetchMeetup', async (_event, date: string, filterTime: string) => {
    const currentDay = new Date(date)
    currentDay.setDate(currentDay.getDate() + 1)
    const nextDay = currentDay.toISOString().split('T')[0]
    const meetupURL = `https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=${date}T03%3A00%3A00-04%3A00&customEndDate=${nextDay}T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles`
    const win = new BrowserWindow({ show: false })
    await win.loadURL(meetupURL)
    await new Promise(resolve => setTimeout(resolve, 3000))
    let previousCount = 0
    while (true) {
      const currentCount = await win.webContents.executeJavaScript(
        `document.querySelectorAll('a[data-event-label="Event Card"]').length`
      )
      if (currentCount === previousCount) break
      console.log('Meetup scroll, previous count:', previousCount)
      previousCount = currentCount
      await win.webContents.executeJavaScript('window.scrollTo(0, document.body.scrollHeight)')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    const meetupHTML = await win.webContents.executeJavaScript('document.documentElement.outerHTML')
    win.destroy()
    const $ = cheerio.load(meetupHTML)
    const meetupCardData = $('a[data-event-label="Event Card"]').map((_i, a) => ({
        href: $(a).attr('href'),
        title: $(a).find('h3').text(),
        img: $(a).find('img').attr('src'),
        time: $(a).find('time').text(),
        group: $(a).find('div.flex-shrink.min-w-0.truncate').text(),
        attendees: $(a).find('span.ds2-m14.py-ds2-8').text(),
        price: ''
    })).toArray()
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
  })
}
