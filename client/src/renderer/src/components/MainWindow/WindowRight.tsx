import { Box } from '@mui/material'
import { JSX } from 'react'
import CommitWindow from './CommitWindow'

export default function WindowRight(): JSX.Element {
  return (
    <Box sx={{ width: '280px', height: 1, backgroundColor: '#222831' }}>
      <CommitWindow />
    </Box>
  )
}
