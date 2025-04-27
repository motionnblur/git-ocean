import { Box } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import { JSX, useEffect, useState } from 'react'
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui'
import RepoView from '../RepoView/RepoView'

// eslint-disable-next-line prettier/prettier, @typescript-eslint/no-explicit-any
let _repoData: any
export default function WindowCenter(): JSX.Element {
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false)
  const [repoViewOpen, setRepoViewOpen] = useState<boolean>(false)
  const [terminalLineData, setTerminalLineData] = useState([
    // eslint-disable-next-line react/jsx-key
    <TerminalOutput>-- Git Ocean terminal --</TerminalOutput>
  ])
  const [cwd, setCwd] = useState<string>(window.electron.systemInfo.cwd)
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
    const handleOutput = (data: string): void => {
      setTerminalLineData((prev) => [
        ...prev,
        <TerminalOutput key={prev.length}>{data}</TerminalOutput>
      ])
    }

    const handleExit = (code: number): void => {
      /* setTerminalLineData((prev) => [
        ...prev,
        <TerminalOutput key={prev.length}>{`Process exited with code ${code}`}</TerminalOutput>
      ]) */
    }
    const handleCwdUpdated = (newCwd: string): void => {
      setCwd(newCwd) // Update the cwd state when the event is received
    }

    window.electron.onCommandOutput(handleOutput)
    window.electron.onCommandExit(handleExit)
    window.electron.onCwdUpdated(handleCwdUpdated)
    window.electron.onRepoViewOpen(handleRepoViewEvent)
    //homeDir = window.electron.systemInfo.homeDir

    eventManager.on('open-terminal', openTerminalEvent)

    return () => {
      eventManager.off('open-terminal', openTerminalEvent)
    }
  }, [])

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#393E46' }}>
      {terminalOpen && (
        <Terminal
          name="Terminal"
          colorMode={ColorMode.Dark}
          onInput={(terminalInput) => {
            if (terminalInput.toLocaleLowerCase() === 'clear') {
              setTerminalLineData([])
            } else {
              window.electron.sendCommand(terminalInput)
            }
          }}
          prompt={`${cwd + ':'}`}
          height="360px"
          TopButtonsPanel={() => null}
        >
          {terminalLineData}
        </Terminal>
      )}
      {repoViewOpen && <RepoView _repoData={_repoData} />}
    </Box>
  )
}
