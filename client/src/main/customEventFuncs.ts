// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGitCommitData = async (execPromise: any): Promise<any[]> => {
  const { stdout: commitData } = await execPromise('git log --format=%H')
  const { stdout: commitNames } = await execPromise('git log --format=%s')
  const { stdout: authorData } = await execPromise('git log --format=%an')
  const { stdout: dateData } = await execPromise('git log --format=%ad')

  const commitDataArray = commitData.trim().split('\n')
  const commitNamesArray = commitNames.trim().split('\n')
  const authorDataArray = authorData.trim().split('\n')
  const dateDataArray = dateData.trim().split('\n')

  return commitDataArray.map((_, index) => ({
    commitData: commitDataArray[index],
    commitName: commitNamesArray[index],
    authorData: authorDataArray[index],
    dateData: dateDataArray[index]
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const changeGitCommitName = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execPromise: any,
  commitHash: string,
  commitName: string
): Promise<void> => {
  console.log(commitHash, commitName)
  await execPromise(`git commit --amend -m "${commitName}" `)
}
