/**
 * Access Facebook API.
 */
class Facebook {
    private static instance: Facebook;

    private constructor() {}

    static getInstance(): Facebook {
        if (!Facebook.instance) {
            Facebook.instance = new Facebook();
        }
        return Facebook.instance;
    }
}

export const facebook = Facebook.getInstance();