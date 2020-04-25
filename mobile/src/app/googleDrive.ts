/**
 * Access Google drive API.
 */
class GoogleDrive {
    private static instance: GoogleDrive;

    private constructor() {}

    static getInstance(): GoogleDrive {
        if (!GoogleDrive.instance) {
            GoogleDrive.instance = new GoogleDrive();
        }
        return GoogleDrive.instance;
    }

    public async foo() {
        try {
            
        } catch (error) {}
    }
}

export const googleDrive = GoogleDrive.getInstance();