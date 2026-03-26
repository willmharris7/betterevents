import { ipcMain, shell } from 'electron'

export function registerOpenExternal() {
  ipcMain.handle('open-external', (_event, url: string) => shell.openExternal(url))
}
