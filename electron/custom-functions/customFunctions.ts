import { ipcMain, shell, BrowserWindow } from 'electron'

export function customFunctions() {
  ipcMain.handle('open-external', (_event, url: string) => shell.openExternal(url))

  ipcMain.handle('fetchMeetup', async (_event, date: string, time: string) => {
    const currentDay = new Date(date)
    currentDay.setDate(currentDay.getDate() + 1)
    const nextDay = currentDay.toISOString().split('T')[0]
    const meetupURL = `https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=${date}T03%3A00%3A00-04%3A00&customEndDate=${nextDay}T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles`
    const res = await fetch(meetupURL)
    const meetupHTML = await res.text()
    const meetupDoc = new DOMParser().parseFromString(meetupHTML, 'text/html')
    return Array.from(meetupDoc.querySelectorAll('a[data-event-label="Event Card"]')).map(a => ({
        href: (a as HTMLAnchorElement).href,
        title: a.querySelector('h3')?.textContent ?? '',
        img: a.querySelector('img')?.src ?? '',
        time: a.querySelector('time')?.textContent ?? '',
        group: a.querySelector('div.flex-shrink.min-w-0.truncate')?.textContent ?? '',
        attendees: a.querySelector('span.ds2-m14.py-ds2-8')?.textContent ?? '',
        price: ''
    }))
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
