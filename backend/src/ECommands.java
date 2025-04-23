public enum ECommands {
    EXECUTE,
    STATUS,
    DIFF,
    ADD_ALL,
    COMMIT_ALL,
    DROP_LAST_COMMIT,
    SQUASH_COMMITS;

    public static ECommands fromString(String command) {
        try {
            return ECommands.valueOf(command.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid command: " + command);
        }
    }
}
