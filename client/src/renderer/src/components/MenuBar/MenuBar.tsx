import { Box, Stack } from '@mui/material'
import { JSX } from 'react'
import UploadButton from './UploadButton'

export default function MenuBar(): JSX.Element {
  return (
    <Box sx={{ width: '100%', backgroundColor: '#0b305d' }}>
      <Stack direction="row">
        <UploadButton />
      </Stack>
    </Box>
  )
}
