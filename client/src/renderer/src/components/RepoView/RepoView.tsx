import { Box, List } from '@mui/material'
import CommitItem from './CommitItem'

// Define a proper type for your repo items if you know it, otherwise keep it generic
export interface RepoItem {
  commitData: string
  commitName: string
  authorData: string
  dateData: string
}

export default function RepoView({ _repoData }: { _repoData: RepoItem[] }): JSX.Element {
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
          <CommitItem key={index} item={item} index={index} />
        ))}
      </List>
    </Box>
  )
}
