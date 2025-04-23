import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Git implements ICommand {
    @Override
    public String execute(String[] args) {
        StringBuilder result = new StringBuilder();
        try {
            ProcessBuilder builder = new ProcessBuilder(args);
            builder.redirectErrorStream(true);
            Process process = builder.start();

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            result.append("Exited with code: ").append(exitCode);

        } catch (Exception e) {
            e.printStackTrace();
            result.append(e.getMessage());
        }

        return result.toString();
    }

    @Override
    public String status() {
        return this.execute(new String[]{"git", "status"});
    }

    @Override
    public String diff() {
        return this.execute(new String[]{"git", "diff"});
    }

    @Override
    public String addAll() {
        return this.execute(new String[]{"git", "add", "."});
    }

    @Override
    public String commitAll(String arg) {
        return this.execute(new String[]{"git", "commit", "-am", arg});
    }

    @Override
    public String squashCommits(int squashCount, String newCommitName) {
        try {
            // Reset to the commit before the range you want to squash
            this.execute(new String[]{"git", "reset", "--soft", "HEAD~" + squashCount});
            // Commit the changes with the message of the first commit in the range
            return this.execute(new String[]{"git", "commit", "-m", newCommitName}); // You might want to retrieve the original message

        } catch (Exception e) {
            e.printStackTrace();
            return null;
            // Handle potential errors
        }
    }

    @Override
    public String dropLastCommit() {
        try {
            return this.execute(new String[]{"git", "reset", "--hard", "HEAD^"});
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public String amendCommit(String newCommitName) {
        try {
            return this.execute(new String[]{"git", "commit", "--amend", "-m", newCommitName});
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
