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
    await execPromise(`git rebase -i ${commitHash}^`, {
      env: {
        ...process.env,
        GIT_SEQUENCE_EDITOR: `sed -i '1s/^pick /edit /'`
      }
    })

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

      // Step 4: Change the first word to firstWord and save the file
      const updatedContent = fileContent
        .split('\n')
        .map((line) => {
          if (line.startsWith('pick') && line.includes(commitHash)) {
            return line.replace(/^pick/, 'edit')
          }
          return line
        })
        .join('\n')
      await fs.promises.writeFile(rebaseTodoPath, updatedContent, 'utf8')
      console.log('Updated rebase todo list:\n', updatedContent)

      const sanitizedCommitName = commitName.replace(/"/g, '\\"')
      await execPromise(`git commit --amend --allow-empty -am "${sanitizedCommitName}"`)

      await execPromise('git rebase --continue')

      try {
        const result = await execPromise('git symbolic-ref --short -q HEAD')
        const branchName =
          typeof result === 'string' ? result.trim() : (result.stdout?.trim?.() ?? '')

        if (!branchName) {
          console.warn('⚠️ HEAD is detached after rebase. You may want to reattach it to a branch.')
        } else {
          console.log(`✅ Rebase completed. HEAD is now on branch '${branchName}'.`)
        }
      } catch (err) {
        console.error('Failed to check HEAD status:', err)
      }
    } catch (err) {
      console.error('Failed to read git-rebase-todo:', err)
    }
  } catch (err) {
    console.error('Rebase command failed:', err)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dropLastCommit = async (execPromise: any): Promise<void> => {
  try {
    await execPromise('git reset --hard HEAD^')
    console.log('Last commit has been dropped.')
  } catch (err) {
    console.error('Failed to drop last commit:', err)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const squashCommits = async (
  execPromise: any,
  numberToSquash: number,
  newCommitMessage: string
): Promise<void> => {
  try {
    await execPromise(`git reset --soft HEAD~${numberToSquash + 1}`) // aaa
    await execPromise(`git commit -m "${newCommitMessage}"`)
  } catch (err) {
    console.error('Failed to squash commits:', err)
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
