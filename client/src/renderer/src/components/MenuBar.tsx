import { Box, Container, IconButton, Stack } from '@mui/material'
import { JSX } from 'react'
import FolderIcon from '@mui/icons-material/Folder'

export default function MenuBar(): JSX.Element {
  return (
    <Box sx={{ width: '100%', backgroundColor: '#0b305d' }}>
      <Stack direction="row">
        <Container>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <FolderIcon fontSize="small" />
          </IconButton>
        </Container>
      </Stack>
    </Box>
  )
}
