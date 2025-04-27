export interface IRepoItem {
  name: string
}
export interface IRepo {
  items: IRepoItem[]
}
export interface IMemory {
  isFileDialogOpen: boolean
  repo: IRepo
  currentGitDirectory: string
}

export const memory: IMemory = {
  isFileDialogOpen: false,
  repo: {
    items: []
  },
  currentGitDirectory: ''
}
