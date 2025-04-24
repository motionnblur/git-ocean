import { IconButton } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import { JSX } from 'react'

export default function UploadButton(): JSX.Element {
  return (
    <IconButton edge="end" color="inherit" aria-label="menu">
      <FolderIcon fontSize="small" />
    </IconButton>
  )
}
