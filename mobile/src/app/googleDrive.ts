import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
// @ts-ignore
import GDrive from "react-native-google-drive-api-wrapper";
import RNFS, { DownloadResult } from "react-native-fs";
import { googleAuth } from "./googleAuth";

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

    private async setAccessToken() {
        let rval: boolean = false;
        const tokens = await googleAuth.getTokens();

        if (tokens && tokens.accessToken) {
            GDrive.setAccessToken(tokens.accessToken);
            GDrive.init();
            rval = true;
        }

        return rval;
    }

    /**
     * Create file on GDrive and return file ID if file was created.
     */
    public async createFileMultipart(args:CreateFileMultipartArgs): Promise<string|Error> {
        // Default args
        if (!args.contentType) args.contentType = 'text/plain';
        
        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }

        try {
            // CREATE: https://bit.ly/3atW5DJ
            const response: Response = await GDrive.files.createFileMultipart(
                args.content,
                args.contentType,
                {
                    parents: [args.parentFolderId],
                    name: args.name
                }
            );

            let responseJson = await response.json();

            if (response.status === 200) {
                return responseJson?.id;
            } else {
                return new Error(responseJson?.error?.message);
            }
        } catch (e) {
            return new Error('GDrive file was not created');
        }
    }

    public async foo() {
        try {
            
        } catch (error) {}
    }
}

class ErrorAccessTokenNotSet extends Error {
    static defaultMessage = 'Google access token was not set';

    public constructor(message:string = ErrorAccessTokenNotSet.defaultMessage) {
        super(message);
    }
}

interface CreateFileMultipartArgs {
    name: string;
    content: any;
    /**
     * 'text/plain' by default
     */
    contentType?: string;
    /**
     * id of parent folder. 'root' has special meaning.
     */
    parentFolderId: string;
}

interface CreateFileMultipartmetadata {
    /**
     * ids of parent folders. 'root' has special meaning.
     */
    parents: string[];
    name: string;
}

export const googleDrive = GoogleDrive.getInstance();