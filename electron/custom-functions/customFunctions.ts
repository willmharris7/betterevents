import { ipcMain, shell, BrowserWindow} from 'electron'
import * as cheerio from 'cheerio'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Store from 'electron-store';
dayjs.extend(customParseFormat);

interface Blocklist {
  meetupTitles: string[]
  meetupGroups: string[]
  eventbriteTitles: string[]
}

const store = new Store<{ blocklist: Blocklist }>();

const defaultBlocklist: Blocklist = { meetupTitles: [], meetupGroups: [], eventbriteTitles: [] }

export function customFunctions() {
  ipcMain.handle('open-external', (_event, url: string) => shell.openExternal(url))

  ipcMain.handle('get-blocklist', () => store.get('blocklist', defaultBlocklist))
  ipcMain.handle('set-blocklist', (_event, blocklist: Blocklist) => store.set('blocklist', blocklist))

  ipcMain.handle('fetchMeetup', async (_event, date: string, filterTime: string) => {
    const currentDay = new Date(date)
    currentDay.setDate(currentDay.getDate() + 1)
    const nextDay = currentDay.toISOString().split('T')[0]
    const meetupURL = `https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=${date}T03%3A00%3A00-04%3A00&customEndDate=${nextDay}T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles`
    const res = await fetch(meetupURL)
    const meetupHTML = await res.text()
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

  ipcMain.handle('fetchEventbrite', async (_event, date: string, filterTime: string) => {
    const eventbriteURL = `https://www.eventbrite.com/d/or--portland/all-events/?page=1&start_date=${date}&end_date=${date}`
    const win = new BrowserWindow({ show: false })
    await win.loadURL(eventbriteURL)
    await new Promise(resolve => setTimeout(resolve, 6000))
    const eventbriteHTML = await win.webContents.executeJavaScript('document.documentElement.outerHTML')
    win.destroy()
    const $ = cheerio.load(eventbriteHTML)
    const eventbriteCardData = $('div[class="Container_root__4i85v NestedActionContainer_root__1jtfr event-card event-card__horizontal horizontal-event-card__action-visibility"]').map((_i, div) => ({
        href: $(div).find('a').attr('href'),
        title: $(div).find('h3').text(),
        img: $(div).find('img').attr('src'),
        time: $(div).find('p[class="Typography_root__487rx #585163 Typography_body-md__487rx event-card__clamp-line--one Typography_align-match-parent__487rx"]').first().text(),
        group: '',
        attendees: '',
        price: $(div).find('p[style="--TypographyColor: #3a3247;"]').text(),
    })).toArray()
    // Pagination text returns "1 of 13"
    const numOfPages = parseInt($('li[class="Pagination-module__search-pagination__navigation-minimal___1eHd9"]').text().split(" ")[2])
    for (let i = 2; i <= numOfPages; i++) {
        console.log(i)
    }

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
  })
}
