export interface CommitData {
  commitData: string
  commitName: string
  authorData: string
  dateData: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
export let selectedGitCommitData: CommitData = {
  commitData: '',
  commitName: '',
  authorData: '',
  dateData: ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type
export function setSelectedGitCommitData(data: CommitData): void {
  selectedGitCommitData = data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSelectedGitCommitData(): CommitData {
  return selectedGitCommitData
}

export let selectedGitCommitIndex: number

export function setSelectedGitCommitIndex(index: number): void {
  selectedGitCommitIndex = index
}

export function getSelectedGitCommitIndex(): number {
  return selectedGitCommitIndex
}
