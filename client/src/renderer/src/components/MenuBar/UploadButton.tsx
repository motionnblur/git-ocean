import { IconButton } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import { JSX, useEffect } from 'react'
import { eventManager } from '@renderer/class/EventManager'
export default function UploadButton(): JSX.Element {
  useEffect(() => {
    window.electron.ipcRenderer.on('alert', () => {
      alert('hello')
    })
  }, [])

  return (
    <IconButton
      edge="end"
      color="inherit"
      aria-label="menu"
      onClick={() => {
        eventManager.trigger('open-file')
      }}
    >
      <FolderIcon fontSize="small" />
    </IconButton>
  )
}
