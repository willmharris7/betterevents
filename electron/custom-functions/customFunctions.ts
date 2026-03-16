import { ipcMain, shell, BrowserWindow } from 'electron'
import * as cheerio from 'cheerio'

export function customFunctions() {
  ipcMain.handle('open-external', (_event, url: string) => shell.openExternal(url))

  ipcMain.handle('fetchMeetup', async (_event, date: string, time: string) => {
    const currentDay = new Date(date)
    currentDay.setDate(currentDay.getDate() + 1)
    const nextDay = currentDay.toISOString().split('T')[0]
    const meetupURL = `https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=${date}T03%3A00%3A00-04%3A00&customEndDate=${nextDay}T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles`
    const res = await fetch(meetupURL)
    const meetupHTML = await res.text()
    const $ = cheerio.load(meetupHTML)
    return $('a[data-event-label="Event Card"]').map((_i, a) => ({
        href: $(a).attr('href'),
        title: $(a).find('h3').text(),
        img: $(a).find('img').attr('src'),
        time: $(a).find('time').text(),
        group: $(a).find('div.flex-shrink.min-w-0.truncate').text(),
        attendees: $(a).find('span.ds2-m14.py-ds2-8').text(),
        price: ''
    })).toArray()
  })

  ipcMain.handle('fetchEventbrite', async (_event, date: string, time: string) => {
    const eventbriteURL = `https://www.eventbrite.com/d/or--portland/all-events/?page=1&start_date=${date}&end_date=${date}`
    const win = new BrowserWindow({ show: false })
    await win.loadURL(eventbriteURL)
    await new Promise(resolve => setTimeout(resolve, 6000))
    const html = await win.webContents.executeJavaScript('document.documentElement.outerHTML')
    win.destroy()
    return html
  })
}
