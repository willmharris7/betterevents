import { Dialog, DialogTitle, DialogContent, Typography, Box, Chip } from '@mui/material'
import { useAppStore } from '../store'

export default function BlocklistPopup() {
  const { blocklistOpen, blocklist, setBlocklistOpen, removeBlocklistItem } = useAppStore()

  async function handleRemoveBlocklistItem(key: 'meetupTitles' | 'meetupGroups' | 'eventbriteTitles', index: number) {
    removeBlocklistItem(key, index)
    const updated = useAppStore.getState().blocklist
    await window.ipcRenderer.setBlocklist(updated)
  }

  return (
    <Dialog open={blocklistOpen} onClose={() => setBlocklistOpen(false)}>
      <DialogTitle>Blocklist</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">Meetup Titles</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {blocklist.meetupTitles.map((title, i) => (
            <Chip key={i} label={title} onDelete={() => handleRemoveBlocklistItem('meetupTitles', i)} />
          ))}
        </Box>
        <Typography variant="subtitle2">Meetup Groups</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {blocklist.meetupGroups.map((group, i) => (
            <Chip key={i} label={group} onDelete={() => handleRemoveBlocklistItem('meetupGroups', i)} />
          ))}
        </Box>
        <Typography variant="subtitle2">Eventbrite Titles</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {blocklist.eventbriteTitles.map((title, i) => (
            <Chip key={i} label={title} onDelete={() => handleRemoveBlocklistItem('eventbriteTitles', i)} />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
