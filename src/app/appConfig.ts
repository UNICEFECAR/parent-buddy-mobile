import { apiConfig } from './apiConfig';

const apiUrlDevelop = 'http://ecaroparentingappt8q2psucpz.devcloud.acquia-sites.com/api';
const apiUrlProduction = 'http://ecaroparentingapppi3xep5h4v.devcloud.acquia-sites.com/api';
// const apiUrlProduction = 'https://parentbuddyapp.org/api';

const forceOneLanguage: string | undefined = undefined;
const apiImagesUrl: string | undefined = undefined;

export const appConfig = {
    // LOCALIZE
    defaultLanguage: 'en',
    defaultCountry: 'SR',
    forceOneLanguage: forceOneLanguage,
    apiImagesUrl: apiImagesUrl,
    // API
    apiUrl: apiUrlProduction,
    apiUsername: apiConfig.apiUsername,
    apiPassword: apiConfig.apiPassword,
    apiAuthUsername: apiConfig.apiAuthUsername,
    apiAuthPassword: apiConfig.apiAuthPassword,
    apiTimeout: 15000,
    apiNumberOfItems: 50,
    showPublishedContent: 1,
    downloadImagesBatchSize: 50, // Works for 15
    downloadImagesIntervalBetweenBatches: 200, // In milliseconds. Works for 3000

    // BACKUP
    backupGDriveFolderName: 'ParentBuddy',
    backupGDriveFileName: 'my.backup',

    // DEVELOPMENT
    // Set to true only during development
    showLog: true,
    preventSync: false,
    deleteRealmFilesBeforeOpen: false,
};