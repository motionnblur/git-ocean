import { Box, Button, Stack, TextField } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import {
  CommitData,
  getSelectedGitCommitData,
  getSelectedGitCommitIndex,
  setSelectedGitCommitData
} from '@renderer/class/LocalMemory'
import { JSX, useEffect, useState } from 'react'

export default function CommitWindow(): JSX.Element {
  const [value, setValue] = useState(getSelectedGitCommitData().commitName)
  const [openDropCommitButton, setOpenDropCommitButton] = useState(
    getSelectedGitCommitIndex() === 0
  )
  const [openSquashCommitsButton, setOpenSquashCommitsButton] = useState(false)

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
  const updateCommitIndexHandler = (commitIndex: number): void => {
    if (commitIndex > 0) {
      setOpenSquashCommitsButton(true)
    } else {
      setOpenSquashCommitsButton(false)
    }
  }
  const squashCommitsHandler = async (): Promise<void> => {
    try {
      await window.electron.squashCommits(getSelectedGitCommitIndex(), value)
      console.log('Commits squashed successfully')
    } catch (error) {
      console.error('Error squashing commits:', error)
    }
  }

  useEffect(() => {
    eventManager.on('commit-message', commitMessageHandler)
    eventManager.on('open-drop-commit-button', openDropCommitButtonHandler)
    eventManager.on('close-drop-commit-button', closeDropCommitButtonHandler)
    eventManager.on('update-commit-index', updateCommitIndexHandler)
    return () => {
      eventManager.off('commit-message', commitMessageHandler)
      eventManager.off('open-drop-commit-button', openDropCommitButtonHandler)
      eventManager.off('close-drop-commit-button', closeDropCommitButtonHandler)
      eventManager.off('update-commit-index', updateCommitIndexHandler)
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
        value={value}
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
          {openSquashCommitsButton && (
            <Button variant="contained" color="success" onClick={squashCommitsHandler}>
              Squash Commits
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
