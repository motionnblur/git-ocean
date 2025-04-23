import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Git implements ICommand {
    @Override
    public void execute(String[] args) {
        try {
            ProcessBuilder builder = new ProcessBuilder(args);
            builder.redirectErrorStream(true);
            Process process = builder.start();

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }
            }

            int exitCode = process.waitFor();
            System.out.println("Exited with code: " + exitCode);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void status() {
        this.execute(new String[]{"git", "status"});
    }

    @Override
    public void diff() {
        this.execute(new String[]{"git", "diff"});
    }

    @Override
    public void addAll() {
        this.execute(new String[]{"git", "add", "."});
    }

    @Override
    public void commitAll(String arg) {
        this.execute(new String[]{"git", "commit", "-am", arg});
    }

    @Override
    public void squashCommits(int squashCount, String newCommitName) {
        try {
            // Reset to the commit before the range you want to squash
            this.execute(new String[]{"git", "reset", "--soft", "HEAD~" + squashCount});
            // Commit the changes with the message of the first commit in the range
            this.execute(new String[]{"git", "commit", "-m", newCommitName}); // You might want to retrieve the original message

        } catch (Exception e) {
            e.printStackTrace();
            // Handle potential errors
        }
    }

    @Override
    public void dropLastCommit() {
        try {
            this.execute(new String[]{"git", "reset", "--hard", "HEAD^"});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
