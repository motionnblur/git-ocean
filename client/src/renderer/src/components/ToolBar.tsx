import { Box, IconButton, Stack } from '@mui/material'
import { JSX } from 'react'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import TerminalIcon from '@mui/icons-material/Terminal'
import { eventManager } from '@renderer/class/EventManager'

export default function ToolBar(): JSX.Element {
  return (
    <Box
      sx={{
        backgroundColor: '#0b307d',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: '80%',
          height: '46px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Stack direction="row" spacing={0.2}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <FileDownloadIcon fontSize="medium" />
          </IconButton>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <FileUploadIcon fontSize="medium" />
          </IconButton>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              eventManager.trigger('open-terminal')
            }}
          >
            <TerminalIcon fontSize="medium" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  )
}
