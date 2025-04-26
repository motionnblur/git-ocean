import { Box, Button, Stack, TextField } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import {
  CommitData,
  getSelectedGitCommitData,
  setSelectedGitCommitData
} from '@renderer/class/LocalMemory'
import { JSX, useEffect, useState } from 'react'

export default function CommitWindow(): JSX.Element {
  const [value, setValue] = useState('')
  const [openDropCommitButton, setOpenDropCommitButton] = useState(false)

  const commitMessageHandler = (message: string): void => {
    setValue(message)
  }
  const changeCommitMessageHandler = (): void => {
    const commitData: CommitData = getSelectedGitCommitData() // Get the current commit data
    commitData.commitName = value
    setSelectedGitCommitData(commitData)

    window.electron.changeGitCommitName(getSelectedGitCommitData())
  }
  const dropLastCommitHandler = async (): Promise<void> => {
    await window.electron.dropLastCommit()
  }
  const openDropCommitButtonHandler = (): void => {
    setOpenDropCommitButton(true)
  }
  /**
   * Handler for the close-drop-commit-button event. Sets openDropCommitButton to false.
   */

  const closeDropCommitButtonHandler = (): void => {
    setOpenDropCommitButton(false)
  }

  useEffect(() => {
    eventManager.on('commit-message', commitMessageHandler)
    eventManager.on('change-commit-message', changeCommitMessageHandler)
    eventManager.on('open-drop-commit-button', openDropCommitButtonHandler)
    eventManager.on('close-drop-commit-button', closeDropCommitButtonHandler)
    return () => {
      eventManager.off('commit-message', commitMessageHandler)
      eventManager.off('change-commit-message', changeCommitMessageHandler)
      eventManager.off('open-drop-commit-button', openDropCommitButtonHandler)
      eventManager.off('close-drop-commit-button', closeDropCommitButtonHandler)
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
        <Stack direction="column" spacing={1} sx={{ paddingTop: '26px' }}>
          <Button variant="contained" onClick={changeCommitMessageHandler}>
            Update Message
          </Button>
          {openDropCommitButton && (
            <Button variant="contained" color="error" onClick={dropLastCommitHandler}>
              Drop Commit
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
