const apiUrlDevelop = 'http://ecaroparentingappt8q2psucpz.devcloud.acquia-sites.com/api';
const apiUrlProduction = 'http://ecaroparentingapppi3xep5h4v.devcloud.acquia-sites.com/api';
// const apiUrlProduction = 'https://parentbuddyapp.org/api';

export const appConfig = {
    // LOCALIZE
    defaultLanguage: 'sr',
    defaultCountry: 'SR',

    // API
    apiUrl: apiUrlProduction,
    apiUsername: 'access_content',
    apiPassword: 'xALRY5Gf2Kn80ZUMHEbd',
    apiAuthUsername: 'administer_users',
    apiAuthPassword: '2AbSyuXrGCe97pBaedCE',
    apiTimeout: 15000,
    apiNumberOfItems: 50,
    showPublishedContent: 1,
    downloadImagesBatchSize: 15, // Works for 15
    downloadImagesIntervalBetweenBatches: 1000, // In milliseconds. Works for 3000

    // BACKUP
    backupGDriveFolderName: 'ParentBuddy',
    backupGDriveFileName: 'my.backup',

    // DEVELOPMENT
    // Set to true only during development
    showLog: false,
    preventSync: false,
    deleteRealmFilesBeforeOpen: false,
};