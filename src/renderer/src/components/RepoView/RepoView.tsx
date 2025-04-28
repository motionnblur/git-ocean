import { Box, List, ListItem, ListItemText } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import { setSelectedGitCommitData, setSelectedGitCommitIndex } from '@renderer/class/LocalMemory'
import { JSX, useEffect, useRef, useState } from 'react'

// Define a proper type for your repo items if you know it, otherwise keep it generic
export interface RepoItem {
  commitData: string
  commitName: string
  authorData: string
  dateData: string
}
export default function RepoView(): JSX.Element {
  const isFirstRender = useRef(true)

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const [_repoData, setRepoData] = useState<RepoItem[]>([])

  const onItemClick = (index: number): void => {
    if (selectedItemIndex === index) return

    setSelectedGitCommitIndex(index)
    setSelectedGitCommitData(_repoData[index])
    eventManager.trigger('update-commit-index', index)
    eventManager.trigger('update-commit-window-text', _repoData[index].commitName)
    eventManager.trigger('open-commit-window')

    if (index === 0) {
      eventManager.trigger('open-drop-commit-button')
    } else {
      eventManager.trigger('close-drop-commit-button') //
    }
    setSelectedItemIndex(index)
  }

  const onGitFolderOpenHandler = (): void => {
    window.electron.ipcRenderer.invoke('get-repo-data-from-memory').then((repoData: RepoItem[]) => {
      setRepoData(repoData)
    })
  }
  const onUpdateMessageButtonClickHandler = async (): Promise<void> => {
    const repoData = await window.electron.ipcRenderer.invoke('get-repo-data')
    setRepoData(repoData)
  }

  useEffect(() => {
    if (isFirstRender.current) {
      window.electron.ipcRenderer
        .invoke('get-repo-data-from-memory')
        .then((repoData: RepoItem[]) => {
          isFirstRender.current = false
          setRepoData(repoData)
        })
    }

    eventManager.on('on-git-folder-open', onGitFolderOpenHandler)
    eventManager.on('on-update-message-button-click', onUpdateMessageButtonClickHandler)
    return () => {
      eventManager.off('on-git-folder-open', onGitFolderOpenHandler)
      eventManager.off('on-update-message-button-click', onUpdateMessageButtonClickHandler)
    }
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <List
        sx={{
          width: '360px',
          height: '400px',
          backgroundColor: 'black',
          overflow: 'hidden',
          borderRadius: '6px',
          boxShadow: '0 0 12px rgba(0, 0, 0, 0.5)', // <-- Shadow here
          '&:hover': {
            overflowY: 'auto'
          },
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: '#5e5e5e transparent',
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#5e5e5e',
            borderRadius: '10px',
            border: '2px solid transparent',
            backgroundClip: 'content-box',
            transition: 'background-color 0.3s ease'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#888'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent'
          }
        }}
      >
        {_repoData.map((item, index) => (
          <ListItem key={index} disablePadding>
            <div
              className={selectedItemIndex === index ? 'list-item-on' : 'list-item-off'}
              onClick={() => onItemClick(index)}
            >
              <ListItemText sx={{ marginLeft: '10px' }} primary={`${item.commitName}`} />
            </div>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
