import { AppBar, Box, IconButton, Toolbar } from '@mui/material'
import { JSX } from 'react'
import FolderIcon from '@mui/icons-material/Folder'

export default function MenuBar(): JSX.Element {
  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <FolderIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
