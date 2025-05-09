import { Box } from '@mui/material'
import { JSX, useEffect, useState } from 'react'
import CommitWindow from './CommitWindow'
import { eventManager } from '@renderer/class/EventManager'

export default function WindowRight(): JSX.Element {
  const [openCommitWindow, setOpenCommitWindow] = useState(false)
  const handleCommitWindowOpen = (): void => {
    setOpenCommitWindow(true)
  }
  useEffect(() => {
    eventManager.on('open-commit-window', handleCommitWindowOpen)
    return () => {
      eventManager.off('open-commit-window', handleCommitWindowOpen)
    }
  }, [])
  return (
    <>
      <Box sx={{ width: '360px', height: 1, backgroundColor: '#222831' }}>
        {openCommitWindow && <CommitWindow />}
      </Box>
    </>
  )
}
