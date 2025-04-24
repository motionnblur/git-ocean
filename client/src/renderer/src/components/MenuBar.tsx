import { Box, IconButton, Stack, Toolbar } from '@mui/material'
import { JSX } from 'react'
import FolderIcon from '@mui/icons-material/Folder'

export default function MenuBar(): JSX.Element {
  return (
    <Box sx={{ width: '100%', backgroundColor: '#0b305d' }}>
      <Stack direction="row">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <FolderIcon />
          </IconButton>
        </Toolbar>
      </Stack>
    </Box>
  )
}
