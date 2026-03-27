import { ipcMain, shell } from 'electron'

export function registerOpenLinksInExternalBrowser() {
  ipcMain.handle('open-external', (_event, url: string) => shell.openExternal(url))
}
