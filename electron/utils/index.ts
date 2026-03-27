import { registerOpenLinksInExternalBrowser } from './openLinksInExternalBrowser'
import { registerBlocklist } from './blocklist'
import { registerFetchMeetup } from './fetchMeetup'
import { registerFetchEventbrite } from './fetchEventbrite'

export function Utils() {
  registerOpenLinksInExternalBrowser()
  registerBlocklist()
  registerFetchMeetup()
  registerFetchEventbrite()
}
