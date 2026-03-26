import { registerOpenExternal } from './openExternal'
import { registerBlocklist } from './blocklist'
import { registerFetchMeetup } from './fetchMeetup'
import { registerFetchEventbrite } from './fetchEventbrite'

export function customFunctions() {
  registerOpenExternal()
  registerBlocklist()
  registerFetchMeetup()
  registerFetchEventbrite()
}
