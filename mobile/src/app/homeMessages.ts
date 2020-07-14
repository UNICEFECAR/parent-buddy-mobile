/**
 * Home messages logic is here.
 */
class HomeMessages {
    private static instance: HomeMessages;

    private constructor() {}

    static getInstance(): HomeMessages {
        if (!HomeMessages.instance) {
            HomeMessages.instance = new HomeMessages();
        }
        return HomeMessages.instance;
    }
}

export const homeMessages = HomeMessages.getInstance();