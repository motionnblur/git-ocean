interface IRepoItem {
  commitData: string
  commitName: string
  authorData: string
  dateData: string
}
interface IRepo {
  items: IRepoItem[]
}
interface IMemory {
  isFileDialogOpen: boolean
  repo: IRepo
  currentGitDirectory: string
  repoData: IRepoItem[]
  squash: ISquash
}
export interface ISquash {
  numberToSquash: number
  newCommitMessage: string
}

export const memory: IMemory = {
  isFileDialogOpen: false,
  repo: {
    items: []
  },
  currentGitDirectory: '',
  repoData: [],
  squash: {
    numberToSquash: 0,
    newCommitMessage: ''
  }
}
