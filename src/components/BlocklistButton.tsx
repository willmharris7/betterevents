import { Button } from '@mui/material'
import { useAppStore } from '../store'

export default function BlocklistButton() {
  const { setBlocklist, setBlocklistOpen } = useAppStore()

  async function openBlocklist() {
    const current = await window.ipcRenderer.getBlocklist()
    setBlocklist(current)
    setBlocklistOpen(true)
  }

  return <Button variant="outlined" onClick={openBlocklist}>Blocklist</Button>
}
