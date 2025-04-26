import { stderr } from 'process'
import fs from 'fs'
import path from 'path'

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
  const currentDir = process.cwd()

  const rebaseTodoList = `
edit ${commitHash}
# other rebase actions can be added if necessary...
`

  // Step 1: Start the git rebase process (but don't try to write the todo list yet)
  try {
    execPromise('git rebase -i ' + commitHash + '^')

    const rebaseTodoPath = path.join(currentDir, '..', '.git', 'rebase-merge', 'git-rebase-todo')
    const rebaseMergeDir = path.dirname(rebaseTodoPath)

    console.log('Rebase Todo Path:', rebaseTodoPath)
    console.log('Rebase Merge Directory:', rebaseMergeDir)

    // Step 2: Wait until the rebase directory is created
    await waitForRebaseDirectory(rebaseMergeDir)
    console.log('Rebase directory is now created:', rebaseMergeDir)

    // Step 3: Read the modified rebase todo list
    try {
      const fileContent = await fs.promises.readFile(rebaseTodoPath, 'utf8')
      console.log('Current rebase todo list:\n', fileContent)
      return fileContent
    } catch (err) {
      console.error('Failed to read git-rebase-todo:', err)
      return null
    }

    if (stderr) {
      console.error('Error during rebase:', error)
    }
  } catch (err) {
    console.error('Rebase command failed:', err)
  }
}

// Helper function to wait for the rebase directory to be created
const waitForRebaseDirectory = async (dirPath: string): Promise<void> => {
  console.log('Waiting for the rebase directory to appear...')
  let attempts = 0
  while (!fs.existsSync(dirPath) && attempts < 10) {
    // Limit to 10 attempts
    // Wait for a brief moment before checking again
    await new Promise((resolve) => setTimeout(resolve, 500)) // 500ms delay
    attempts++
  }
  if (!fs.existsSync(dirPath)) {
    console.error('Rebase directory still not found after multiple attempts')
  } else {
    console.log('Rebase directory found!')
  }
}
