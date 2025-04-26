import { Box, Button, TextField } from '@mui/material'
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
  const changeCommitMessageHandler = (): void => {
    const commitData: CommitData = getSelectedGitCommitData() // Get the current commit data
    commitData.commitName = value
    setSelectedGitCommitData(commitData)

    window.electron.changeGitCommitName(getSelectedGitCommitData())
  }

  useEffect(() => {
    eventManager.on('commit-message', commitMessageHandler)
    eventManager.on('change-commit-message', changeCommitMessageHandler)
    return () => {
      eventManager.off('commit-message', commitMessageHandler)
      eventManager.off('change-commit-message', changeCommitMessageHandler)
    }
  }, [])

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}
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
      />

      <Box
        sx={{
          width: '100%',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button variant="contained" onClick={changeCommitMessageHandler}>
          Update Message
        </Button>
      </Box>
    </Box>
  )
}
