// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGitCommitData = async (execPromise: any): Promise<any> => {
  const { stdout: commitData } = await execPromise('git log -1 --format=%H')
  const { stdout: commitName } = await execPromise('git log -1 --format=%s')
  const { stdout: authorData } = await execPromise('git log -1 --format=%an')
  const { stdout: dateData } = await execPromise('git log -1 --format=%ad')

  return {
    commitData: commitData.trim(),
    commitName: commitName.trim(),
    authorData: authorData.trim(),
    dateData: dateData.trim()
  }
}
