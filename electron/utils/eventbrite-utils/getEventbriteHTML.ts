import { BrowserWindow } from 'electron'

export async function getEventbriteHTML(eventbriteURL: string): Promise<string> {
  const win = new BrowserWindow({ show: false })
  await win.loadURL(eventbriteURL)
  await new Promise(resolve => setTimeout(resolve, 6000))
  const eventbriteHTML = await win.webContents.executeJavaScript('document.documentElement.outerHTML')
  win.destroy()
  return eventbriteHTML
}
