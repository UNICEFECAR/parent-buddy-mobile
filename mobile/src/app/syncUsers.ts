import { googleAuth } from "./googleAuth";
import { googleDrive } from "./googleDrive";
import { userRealmStore } from "../stores/userRealmStore";
import { appConfig } from "./appConfig";
import RNFS from 'react-native-fs';
import { apiStore, dataRealmStore } from "../stores";
import { UserRealmContextValue } from "../stores/UserRealmContext";
import { translate } from "../translations/translate";

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

    public async exportData(receiverGmail:string): Promise<boolean> {
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

        // Delete previous sync
        this.deleteApiSyncData(receiverGmail);

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
            role: 'writer',
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

    public async isThereDataForImport(receiverGmail:string): Promise<boolean> {
        let rval = false;

        const apiResponse: {donwloaded:boolean} | null = await apiStore.getVariable(`importData_${receiverGmail}`);
        if (apiResponse === null || !apiResponse) return false;

        if (apiResponse.donwloaded === false) {
            return true;
        }

        return rval;
    }

    public async deleteApiSyncData(receiverGmail:string): Promise<boolean> {
        return await apiStore.deleteVariable(`importData_${receiverGmail}`);
    }

    public async importData(userRealmContext: UserRealmContextValue, receiverGmail:string): Promise<void|Error> {
        const tokens = await googleAuth.getTokens();

        // Sign in if neccessary
        if (!tokens) {
            const user = await googleAuth.signIn();
            if (!user) return new Error(translate('loginCanceled'));
        }

        // Validate
        if (!receiverGmail || receiverGmail == '') {
            return new Error('importData requires email');
        }

        const exportFilename = `${receiverGmail}.export`;

        // // Get backupFolderId
        // let backupFolderId = await googleDrive.safeCreateFolder({
        //     name: appConfig.backupGDriveFolderName,
        //     parentFolderId: 'root'
        // });

        // if (backupFolderId instanceof Error) {
        //     return new Error('Backup folder doesnt exist on GDrive');
        // }

        // Get backup file ID if exists on GDrive
        let backupFileId: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${exportFilename}') and sharedWithMe`,
        });

        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
        }

        if (!backupFileId) {
            return new Error(translate('settingsButtonImportError'));
        }

        // Close user realm
        userRealmContext.closeRealm();

        // Download file from GDrive
        await googleDrive.download({
            fileId: backupFileId,
            filePath: RNFS.DocumentDirectoryPath + '/' + 'user.realm',
        });

        // Open user realm
        await userRealmContext.openRealm();

        // Set current child to first child
        const allChildren = userRealmStore.getAllChildren();
        if (allChildren) {
            dataRealmStore.setVariable('currentActiveChildId', allChildren[0].id);
        }

        // Set variable on apiStore
        const setApiVariableResponse = await apiStore.setVariable(`importData_${receiverGmail}`, {
            donwloaded: true,
        });

        if (!setApiVariableResponse) {
            return new Error('importData could not set apiStore variable');
        }

        return;
    }
}

export const syncUsers = SyncUsers.getInstance();