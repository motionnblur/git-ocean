import { Box, TextField } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import {
  CommitData,
  getSelectedGitCommitData,
  setSelectedGitCommitData
} from '@renderer/class/LocalMemory'
import { JSX, useEffect, useState } from 'react'

let textDisabled: boolean = true
export default function CommitWindow(): JSX.Element {
  const [value, setValue] = useState('')

  const commitMessageHandler = (message: string): void => {
    textDisabled = false
    setValue(message)
  }
  const handleKeyDown = (event): void => {
    if (event.key === 'Enter') {
      const commitData: CommitData = getSelectedGitCommitData() // Get the current commit data
      commitData.commitName = value
      setSelectedGitCommitData(commitData)

      window.electron.changeGitCommitName(getSelectedGitCommitData())
    }
  }

  useEffect(() => {
    eventManager.on('commit-message', commitMessageHandler)
    return () => {
      eventManager.off('commit-message', commitMessageHandler)
    }
  }, [])

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' }, display: 'flex', justifyContent: 'center' }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        hiddenLabel
        variant="filled"
        sx={{ backgroundColor: 'white' }}
        multiline
        rows={1}
        maxRows={1}
        defaultValue={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={textDisabled}
        onKeyDown={handleKeyDown}
      />
    </Box>
  )
}
