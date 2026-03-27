import * as cheerio from 'cheerio'

export function parseMeetupHTMLtoCardArray(meetupHTML: string) {
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
}
