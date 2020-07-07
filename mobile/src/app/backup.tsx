/**
 * Export / import data to GDrive in order to create backup.
 */
class Backup {
    private static instance: Backup;

    private constructor() {}

    static getInstance(): Backup {
        if (!Backup.instance) {
            Backup.instance = new Backup();
        }
        return Backup.instance;
    }
}

export const backup = Backup.getInstance();