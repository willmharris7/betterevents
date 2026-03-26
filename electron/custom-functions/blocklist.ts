import { ipcMain } from 'electron'
import Store from 'electron-store';

interface Blocklist {
  meetupTitles: string[]
  meetupGroups: string[]
  eventbriteTitles: string[]
}

export const store = new Store<{ blocklist: Blocklist }>();
export const defaultBlocklist: Blocklist = { meetupTitles: [], meetupGroups: [], eventbriteTitles: [] }

export function registerBlocklist() {
  ipcMain.handle('get-blocklist', () => store.get('blocklist', defaultBlocklist))
  ipcMain.handle('set-blocklist', (_event, blocklist: Blocklist) => store.set('blocklist', blocklist))
}
