import { Box, List, ListItem, ListItemText } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import { setSelectedGitCommitData } from '@renderer/class/LocalMemory'
import { JSX, useState } from 'react'

// Define a proper type for your repo items if you know it, otherwise keep it generic
export interface RepoItem {
  commitData: string
  commitName: string
  authorData: string
  dateData: string
}

export default function RepoView({ _repoData }: { _repoData: RepoItem[] }): JSX.Element {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)

  const onItemClick = (index: number): void => {
    setSelectedGitCommitData(_repoData[index])
    eventManager.trigger('commit-message', _repoData[index].commitName)
    setSelectedItemIndex(index)
  }

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
