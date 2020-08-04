/**
 * Sync user data between users with GDrive.
 */
class SyncUsers {
    private static instance: SyncUsers;

    private constructor() {}

    static getInstance(): SyncUsers {
        if (!SyncUsers.instance) {
            SyncUsers.instance = new SyncUsers();
        }
        return SyncUsers.instance;
    }
}

export const syncUsers = SyncUsers.getInstance();