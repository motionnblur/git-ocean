import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { JSX } from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function renderRow(props: ListChildComponentProps) {
  const { index, style } = props

  return (
    <ListItem
      style={style}
      key={index}
      component="div"
      disablePadding
      sx={{ backgroundColor: 'black' }}
    >
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RepoView({ _repoData }: { _repoData: any }): JSX.Element {
  console.log(_repoData)
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
        {renderRow}
      </FixedSizeList>
    </Box>
  )
}
