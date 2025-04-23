public interface ICommand {
    String execute(String[] args);
    String status();
    String diff();
    String addAll();
    String commitAll(String arg);
    String squashCommits(int squashCount, String newCommitName);
    String dropLastCommit();
}
