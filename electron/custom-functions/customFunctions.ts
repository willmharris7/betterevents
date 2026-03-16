import { ipcMain, shell, BrowserWindow } from 'electron'

export function customFunctions() {
  ipcMain.handle('open-external', (_event, url: string) => shell.openExternal(url))

  ipcMain.handle('fetchMeetup', async (_event, url: string) => {
    const res = await fetch(url)
    return await res.text()
  })

  ipcMain.handle('fetchEventbrite', async (_event, url: string) => {
    const win = new BrowserWindow({ show: false })
    await win.loadURL(url)
    await new Promise(resolve => setTimeout(resolve, 6000))
    const html = await win.webContents.executeJavaScript('document.documentElement.outerHTML')
    win.destroy()
    return html
  })
}
