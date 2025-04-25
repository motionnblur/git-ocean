import { Box, List, ListItem, ListItemText } from '@mui/material'

// Define a proper type for your repo items if you know it, otherwise keep it generic
interface RepoItem {
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
          <ListItem key={index} disablePadding>
            <div className="list-item">
              <ListItemText sx={{ marginLeft: '10px' }} primary={`${item.commitName}`} />
            </div>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
