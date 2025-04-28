import { Box } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import { JSX, useEffect, useState } from 'react'
import RepoView from '../RepoView/RepoView'
import TerminalComponent from './TerminalComponent'

export default function WindowCenter(): JSX.Element {
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false)
  const [repoViewOpen, setRepoViewOpen] = useState<boolean>(false)

  const openTerminalEvent = (): void => {
    setTerminalOpen((prev) => !prev)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnGitFolderOpen = (): void => {
    if (!repoViewOpen) {
      setRepoViewOpen(true)
    }
  }

  useEffect(() => {
    eventManager.on('on-git-folder-open', handleOnGitFolderOpen)
    eventManager.on('open-terminal', openTerminalEvent)

    return () => {
      eventManager.off('on-git-folder-open', handleOnGitFolderOpen)
      eventManager.off('open-terminal', openTerminalEvent)
    }
  }, [])

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#393E46' }}>
      {terminalOpen && <TerminalComponent />}
      {repoViewOpen && <RepoView />}
    </Box>
  )
}
