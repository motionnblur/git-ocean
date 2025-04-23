public interface ICommand {
    void execute(String[] args);
    void status();
    void diff();
    void addAll();
    void commitAll(String arg);
    void squashCommits(int squashCount, String newCommitName);
    void dropLastCommit();
}
