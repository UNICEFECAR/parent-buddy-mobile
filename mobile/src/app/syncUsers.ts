import { googleAuth } from "./googleAuth";
import { googleDrive } from "./googleDrive";
import { userRealmStore } from "../stores/userRealmStore";
import { appConfig } from "./appConfig";
import RNFS from 'react-native-fs';
import { apiStore } from "../stores";

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

    public async exportData(receiverGmail:string) {
        const tokens = await googleAuth.getTokens();

        // Validate
        if (!receiverGmail || receiverGmail == '') {
            return false;
        }

        const exportFilename = `${receiverGmail}.export`;

        // Sign in if neccessary
        if (!tokens) {
            const user = await googleAuth.signIn();
            if (!user) return false;
        }

        // Get userRealmPath
        const userRealmPath = userRealmStore.realm?.path;
        if (!userRealmPath) return false;

        // Get realmContent
        const realmContent = await RNFS.readFile(userRealmPath, 'base64');

        // Get backupFolderId
        let backupFolderId = await googleDrive.safeCreateFolder({
            name: appConfig.backupGDriveFolderName,
            parentFolderId: 'root'
        });

        if (backupFolderId instanceof Error) {
            return false;
        }

        // Get export file ID if exists on GDrive
        let exportFileId: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${exportFilename}') and ('${backupFolderId}' in parents)`,
        });

        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            exportFileId = backupFiles[0].id;
        }

        // Delete exportFileId
        if (exportFileId) {
            await googleDrive.deleteFile(exportFileId);
        }

        // Create file on gdrive
        const newFileId = await googleDrive.createFileMultipart({
            name: exportFilename,
            content: realmContent,
            contentType: 'application/realm',
            parentFolderId: backupFolderId,
            isBase64: true,
        });

        if (typeof newFileId !== 'string') {
            return false;
        }

        // Set permissions on a file
        const permissionsResponse = await googleDrive.createPermissions(newFileId, {
            emailAddress: receiverGmail,
            role: 'reader',
            type: 'user',
        })
        
        if (permissionsResponse instanceof Error) {
            return false;
        }

        // Set variable on apiStore
        const setApiVariableResponse = await apiStore.setVariable(`importData_${receiverGmail}`, {
            donwloaded: false,
        });

        if (!setApiVariableResponse) {
            return false;
        }

        return true;
    }
}

export const syncUsers = SyncUsers.getInstance();