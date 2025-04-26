import { IconButton } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import { JSX } from 'react'
import { eventManager } from '@renderer/class/EventManager'
export default function UploadButton(): JSX.Element {
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
