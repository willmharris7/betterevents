BetterEvents is a web-scraping app that delivers a better user experience for browsing Meetup.com and Eventbrite.com
- Consolidates Meetup and Eventbrite events in one place 
- Provides a start time filter that only shows events after a certain time of day (this is not available on either the Meetup or Eventbrite websites)
- Provides a blocklist option that lets you block events by title or organizer. 

It is built with Electron, React, and Material UI. Frontend logic is found in /src/App.tsx, /src/store.ts, /src/theme.ts, and /src/components. Backend logic is found in /electron/utils

To run the code directly, download from Github and use "npm run dev"

To run as a native program for Mac or Windows, go to https://github.com/willmharris7/betterevents/releases/tag/v1.0.6 and download it there. Note: this code is currently unsigned. On Mac, run xattr -cr /Applications/BetterEvents.app in the terminal after you've installed the app. 