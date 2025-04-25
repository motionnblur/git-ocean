import { ListItem, ListItemText } from '@mui/material'
import { RepoItem } from './RepoView'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CommitItem({
  item,
  index
}: {
  item: RepoItem
  index: number
}): JSX.Element {
  return (
    <ListItem key={index} disablePadding>
      <div className="list-item">
        <ListItemText sx={{ marginLeft: '10px' }} primary={`${item.commitName}`} />
      </div>
    </ListItem>
  )
}
