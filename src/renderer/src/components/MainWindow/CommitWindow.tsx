import { Box, Button, Stack, TextareaAutosize } from '@mui/material'
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
  const changeCommitMessageHandler = async (): Promise<void> => {
    const commitData: CommitData = getSelectedGitCommitData() // Get the current commit data
    commitData.commitName = value
    setSelectedGitCommitData(commitData)

    try {
      await window.electron.ipcRenderer.invoke('change-git-commit-name', commitData)
      eventManager.trigger('on-update-message-button-click')
    } catch (error) {
      console.error('Error changing commit name:', error)
    }
  }
  const dropLastCommitHandler = async (): Promise<void> => {
    await window.electron.dropLastCommit()
  }
  const openDropCommitButtonHandler = (): void => {
    setOpenDropCommitButton(true)
  }

  const closeDropCommitButtonHandler = (): void => {
    setOpenDropCommitButton(false)
  }
  const updateCommitIndexHandler = (commitIndex: number): void => {
    if (commitIndex > 0) {
      setOpenSquashCommitsButton(true)
    } else {
      setOpenSquashCommitsButton(false)
    }
  } ///
  const squashCommitsHandler = async (): Promise<void> => {
    try {
      await window.electron.squashCommits(getSelectedGitCommitIndex(), value)
      eventManager.trigger('on-squash-commits-button-click')
    } catch (error) {
      console.error('Error squashing commits:', error)
    }
  }

  useEffect(() => {
    const firstCommitIndex = getSelectedGitCommitIndex()
    if (firstCommitIndex > 0) {
      if (!openSquashCommitsButton) setOpenSquashCommitsButton(true)
    }

    eventManager.on('update-commit-window-text', commitMessageHandler)
    eventManager.on('open-drop-commit-button', openDropCommitButtonHandler)
    eventManager.on('close-drop-commit-button', closeDropCommitButtonHandler)
    eventManager.on('update-commit-index', updateCommitIndexHandler)
    return () => {
      eventManager.off('update-commit-window-text', commitMessageHandler)
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
      <TextareaAutosize
        aria-label="minimum height"
        minRows={3}
        placeholder="Minimum 3 rows"
        style={{
          width: 276,
          minWidth: 276,
          maxWidth: 276,
          height: 40,
          minHeight: 40,
          maxHeight: 80
        }}
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
