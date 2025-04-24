import { Box, Stack } from '@mui/material'
import { JSX } from 'react'
import WindowLeft from './WindowLeft'
import WindowCenter from './WindowCenter'
import WindowRight from './WindowRight'

export default function MainWindow(): JSX.Element {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#222831'
      }}
    >
      <Stack direction="row">
        <WindowLeft />
        <WindowCenter />
        <WindowRight />
      </Stack>
    </Box>
  )
}
