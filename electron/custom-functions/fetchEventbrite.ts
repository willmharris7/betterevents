import { ipcMain, BrowserWindow } from 'electron'
import * as cheerio from 'cheerio'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { store, defaultBlocklist } from './blocklist';
dayjs.extend(customParseFormat);

export function registerFetchEventbrite() {
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
      const eventbriteURLNewPage = `https://www.eventbrite.com/d/or--portland/all-events/?page=${i}&start_date=${date}&end_date=${date}`
      console.log(eventbriteURLNewPage)
      const winNew = new BrowserWindow({ show: false })
      await winNew.loadURL(eventbriteURLNewPage)
      await new Promise(resolve => setTimeout(resolve, 6000))
      const eventbriteHTMLNewPage = await winNew.webContents.executeJavaScript('document.documentElement.outerHTML')
      winNew.destroy()
      const $ = cheerio.load(eventbriteHTMLNewPage)
      const eventbriteCardDataNewPage = $('div[class="Container_root__4i85v NestedActionContainer_root__1jtfr event-card event-card__horizontal horizontal-event-card__action-visibility"]').map((_i, div) => ({
          href: $(div).find('a').attr('href'),
          title: $(div).find('h3').text(),
          img: $(div).find('img').attr('src'),
          time: $(div).find('p[class="Typography_root__487rx #585163 Typography_body-md__487rx event-card__clamp-line--one Typography_align-match-parent__487rx"]').first().text(),
          group: '',
          attendees: '',
          price: $(div).find('p[style="--TypographyColor: #3a3247;"]').text(),
      })).toArray()
      eventbriteCardData.push(...eventbriteCardDataNewPage)
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
