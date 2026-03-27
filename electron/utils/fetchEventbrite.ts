import { ipcMain } from 'electron'
import * as cheerio from 'cheerio'
import { getEventbriteHTML } from './eventbrite-utils/getEventbriteHTML';
import { parseEventbriteHTMLtoCardArray } from './eventbrite-utils/parseEventbriteHTMLtoCardArray';
import { filterEventbriteCardData } from './eventbrite-utils/filterEventbriteCardData';
export function registerFetchEventbrite() {
  ipcMain.handle('fetchEventbrite', async (_event, date: string, filterTime: string) => {
    const eventbriteURL = `https://www.eventbrite.com/d/or--portland/all-events/?page=1&start_date=${date}&end_date=${date}`
    const eventbriteHTML = await getEventbriteHTML(eventbriteURL)
    const eventbriteCardData = parseEventbriteHTMLtoCardArray(eventbriteHTML)
    const $ = cheerio.load(eventbriteHTML)
    // Pagination text returns "1 of 13" and this grabs the "13"
    const numOfPages = parseInt($('li[class="Pagination-module__search-pagination__navigation-minimal___1eHd9"]').text().split(" ")[2])
    for (let i = 2; i <= numOfPages; i++) {
      const eventbriteURLNewPage = `https://www.eventbrite.com/d/or--portland/all-events/?page=${i}&start_date=${date}&end_date=${date}`
      const eventbriteHTMLNewPage = await getEventbriteHTML(eventbriteURLNewPage)
      const eventbriteCardDataNewPage = parseEventbriteHTMLtoCardArray(eventbriteHTMLNewPage)
      eventbriteCardData.push(...eventbriteCardDataNewPage)
    }
    return filterEventbriteCardData(eventbriteCardData, filterTime)
  })
}
