import { BrowserWindow } from 'electron'

export async function getMeetupHTML(meetupURL: string): Promise<string> {
  const win = new BrowserWindow({ show: false })
  await win.loadURL(meetupURL)
  await new Promise(resolve => setTimeout(resolve, 3000))
  let previousCount = 0
  while (true) {
    const currentCount = await win.webContents.executeJavaScript(
      `document.querySelectorAll('a[data-event-label="Event Card"]').length`
    )
    if (currentCount === previousCount) break
    previousCount = currentCount
    await win.webContents.executeJavaScript('window.scrollTo(0, document.body.scrollHeight)')
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
  const meetupHTML = await win.webContents.executeJavaScript('document.documentElement.outerHTML')
  win.destroy()
  return meetupHTML
}
