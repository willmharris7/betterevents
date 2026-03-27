import * as cheerio from 'cheerio'

export function parseEventbriteHTMLtoCardArray(eventbriteHTML: string) {
  const $ = cheerio.load(eventbriteHTML)
  return $('div[class="Container_root__4i85v NestedActionContainer_root__1jtfr event-card event-card__horizontal horizontal-event-card__action-visibility"]').map((_i, div) => ({
      href: $(div).find('a').attr('href'),
      title: $(div).find('h3').text(),
      img: $(div).find('img').attr('src'),
      time: $(div).find('p[class="Typography_root__487rx #585163 Typography_body-md__487rx event-card__clamp-line--one Typography_align-match-parent__487rx"]').first().text(),
      group: '',
      attendees: '',
      price: $(div).find('p[style="--TypographyColor: #3a3247;"]').text(),
  })).toArray()
}
