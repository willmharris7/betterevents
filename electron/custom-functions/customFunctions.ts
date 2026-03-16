import { ipcMain, shell } from 'electron'

export function customFunctions() {
  ipcMain.handle('open-external', (_event, url: string) => shell.openExternal(url))

  ipcMain.handle('fetchMeetup', async (_event, url: string) => {
    const res = await fetch(url)
    return await res.text()
  })

  ipcMain.handle('fetchEventbrite', async (_event, url: string) => {
    const res = await fetch(url)
    return await res.text()
  })
}
