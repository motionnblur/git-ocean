export interface IRepoItem {
  commitData: string
  commitName: string
  authorData: string
  dateData: string
}

export interface IRepo {
  items: IRepoItem[]
}
export interface IMemory {
  isFileDialogOpen: boolean
  repo: IRepo
  currentGitDirectory: string
  repoData: IRepoItem[]
}

export const memory: IMemory = {
  isFileDialogOpen: false,
  repo: {
    items: []
  },
  currentGitDirectory: '',
  repoData: []
}
