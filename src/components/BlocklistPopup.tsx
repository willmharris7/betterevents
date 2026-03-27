import { Accordion, AccordionDetails, AccordionSummary, Dialog, DialogTitle, DialogContent, Box, Chip, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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
      <DialogTitle sx={{ fontSize: '2.2rem' }}>Blocklist</DialogTitle>
      <DialogContent>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontSize: '1.6rem' }}>Meetup Titles</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {blocklist.meetupTitles.map((title, i) => (
                <Chip key={i} label={title} onDelete={() => handleRemoveBlocklistItem('meetupTitles', i)} sx={{ fontSize: '1.1rem' }} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontSize: '1.6rem' }}>Meetup Groups</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {blocklist.meetupGroups.map((group, i) => (
                <Chip key={i} label={group} onDelete={() => handleRemoveBlocklistItem('meetupGroups', i)} sx={{ fontSize: '1.1rem' }} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontSize: '1.6rem' }}>Eventbrite Titles</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {blocklist.eventbriteTitles.map((title, i) => (
                <Chip key={i} label={title} onDelete={() => handleRemoveBlocklistItem('eventbriteTitles', i)} sx={{ fontSize: '1.1rem' }} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
    </Dialog>
  )
}
