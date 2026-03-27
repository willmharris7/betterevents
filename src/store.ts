import { create } from 'zustand'
import dayjs from 'dayjs'

interface Event { href: string; title: string; img: string; time: string; group: string; attendees: string; price: string }

interface Blocklist {
  meetupTitles: string[]
  meetupGroups: string[]
  eventbriteTitles: string[]
}

interface AppState {
  meetupResults: Event[]
  eventbriteResults: Event[]
  checkboxes: { meetup: boolean; eventbrite: boolean }
  date: string
  time: string
  blocklistOpen: boolean
  blocklist: Blocklist

  setDate: (date: string) => void
  setTime: (time: string) => void
  setMeetupResults: (results: Event[]) => void
  setEventbriteResults: (results: Event[]) => void
  toggleCheckbox: (key: 'meetup' | 'eventbrite') => void
  setBlocklistOpen: (open: boolean) => void
  setBlocklist: (blocklist: Blocklist) => void
  removeBlocklistItem: (key: keyof Blocklist, index: number) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  meetupResults: [],
  eventbriteResults: [],
  checkboxes: { meetup: true, eventbrite: true },
  date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
  time: '00:00',
  blocklistOpen: false,
  blocklist: { meetupTitles: [], meetupGroups: [], eventbriteTitles: [] },

  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setMeetupResults: (results) => set({ meetupResults: results }),
  setEventbriteResults: (results) => set({ eventbriteResults: results }),
  toggleCheckbox: (key) => set((state) => ({ checkboxes: { ...state.checkboxes, [key]: !state.checkboxes[key] } })),
  setBlocklistOpen: (open) => set({ blocklistOpen: open }),
  setBlocklist: (blocklist) => set({ blocklist }),
  removeBlocklistItem: (key, index) => {
    const blocklist = get().blocklist
    set({ blocklist: { ...blocklist, [key]: blocklist[key].filter((_, i) => i !== index) } })
  },
}))
