import { ipcMain, shell } from 'electron'

export function customFunctions() {
  ipcMain.handle('open-external', (_event, url: string) => shell.openExternal(url))

  ipcMain.handle('fetch-example', async (_event, url: string) => {
    const res = await fetch(url)
    return await res.text()
  })
}
