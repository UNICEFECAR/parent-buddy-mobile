import { GoogleSignin, User, statusCodes } from '@react-native-community/google-signin';

/**
 * Authenticate with Google.
 */
class GoogleAuth {
    private static instance: GoogleAuth;

    private constructor() {}

    static getInstance(): GoogleAuth {
        if (!GoogleAuth.instance) {
            GoogleAuth.instance = new GoogleAuth();
        }
        return GoogleAuth.instance;
    }

    public async signIn() {
        let user: User|null = null;

        try {
            await GoogleSignin.hasPlayServices();
            user = await GoogleSignin.signIn();
        } catch (error) {
            // error.code === statusCodes.SIGN_IN_CANCELLED
        }

        return user;
    }

    public async isSignedIn() {
        let isSignedIn: boolean = false;
        
        try {
            isSignedIn = await GoogleSignin.isSignedIn();
        } catch (error) {}

        return isSignedIn;
    }

    public async getCurrentUser() {
        let currentUser: User|null = null;

        try {
            currentUser = await GoogleSignin.getCurrentUser();
        } catch (error) {}

        return currentUser;
    }

    /**
     * Don't save tokens anywhere, always request new tokens so they are refreshed.
     */
    public async getTokens() {
        let tokens: {idToken:string, accessToken: string} | null = null;

        try {
            tokens = await GoogleSignin.getTokens();
        } catch (error) {}

        return tokens;
    }

    public async signOut() {
        let signOut: null = null;

        try {
            signOut = await GoogleSignin.signOut();
        } catch (error) {}

        return signOut;
    }

    public async foo() {
        try {
            
        } catch (error) {}
    }
}

export const googleAuth = GoogleAuth.getInstance();