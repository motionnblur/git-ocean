import { Box } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import { JSX, useEffect, useState } from 'react'
import RepoView from '../RepoView/RepoView'
import TerminalComponent from './TerminalComponent'

// eslint-disable-next-line prettier/prettier, @typescript-eslint/no-explicit-any
let _repoData: any
export default function WindowCenter(): JSX.Element {
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false)
  const [repoViewOpen, setRepoViewOpen] = useState<boolean>(false)

  const openTerminalEvent = (): void => {
    setTerminalOpen((prev) => !prev)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRepoViewEvent = (repoData: any): void => {
    //console.log(repoData)
    _repoData = repoData
    setRepoViewOpen((prev) => !prev)
  }

  useEffect(() => {
    window.electron.onRepoViewOpen(handleRepoViewEvent)

    eventManager.on('open-terminal', openTerminalEvent)

    return () => {
      eventManager.off('open-terminal', openTerminalEvent)
    }
  }, [])

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#393E46' }}>
      {terminalOpen && <TerminalComponent />}
      {repoViewOpen && <RepoView _repoData={_repoData} />}
    </Box>
  )
}
