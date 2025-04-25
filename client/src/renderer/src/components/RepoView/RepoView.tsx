import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

// Define a proper type for your repo items if you know it, otherwise keep it generic
interface RepoItem {
  commitData: string
  commitName: string
  authorData: string
  dateData: string
}

interface RepoViewProps {
  _repoData: RepoItem[]
}

// Function that returns a row renderer with access to _repoData
function renderRow(_repoData: RepoItem[]) {
  return function Row({ index, style }: ListChildComponentProps) {
    const item = _repoData[index]

    return (
      <ListItem
        style={style}
        key={index}
        component="div"
        disablePadding
        sx={{ backgroundColor: 'black' }}
      >
        <ListItemButton>
          <ListItemText primary={`${item.commitName}`} />
        </ListItemButton>
      </ListItem>
    )
  }
}

export default function RepoView({ _repoData }: RepoViewProps): JSX.Element {
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
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={_repoData.length}
        overscanCount={5}
      >
        {renderRow(_repoData)}
      </FixedSizeList>
    </Box>
  )
}
