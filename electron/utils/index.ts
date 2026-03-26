import { registerOpenExternal } from './openExternal'
import { registerBlocklist } from './blocklist'
import { registerFetchMeetup } from './fetchMeetup'
import { registerFetchEventbrite } from './fetchEventbrite'

export function Utils() {
  registerOpenExternal()
  registerBlocklist()
  registerFetchMeetup()
  registerFetchEventbrite()
}
