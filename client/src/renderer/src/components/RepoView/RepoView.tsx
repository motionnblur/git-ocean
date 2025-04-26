import { Box, List, ListItem, ListItemText } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import { setSelectedGitCommitData, setSelectedGitCommitIndex } from '@renderer/class/LocalMemory'
import { JSX, useEffect, useState } from 'react'

// Define a proper type for your repo items if you know it, otherwise keep it generic
export interface RepoItem {
  commitData: string
  commitName: string
  authorData: string
  dateData: string
}

export default function RepoView({ _repoData }: { _repoData: RepoItem[] }): JSX.Element {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const [repoData, setRepoData] = useState(_repoData)

  const onItemClick = (index: number): void => {
    setSelectedGitCommitIndex(index)
    setSelectedGitCommitData(_repoData[index])
    eventManager.trigger('update-commit-index', index)
    eventManager.trigger('open-commit-window')
    eventManager.trigger('commit-message', _repoData[index].commitName)

    if (index === 0) {
      eventManager.trigger('open-drop-commit-button')
    } else {
      eventManager.trigger('close-drop-commit-button')
    }
    setSelectedItemIndex(index)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRefreshRepoView = (data: any): void => {
    setRepoData(data)
  }

  useEffect(() => {
    eventManager.on('refresh-repo-view', handleRefreshRepoView)
    return () => {
      eventManager.off('refresh-repo-view', handleRefreshRepoView)
    }
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#171130',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <List sx={{ width: '360px', height: '400px', backgroundColor: 'black', overflow: 'auto' }}>
        {repoData.map((item, index) => (
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
