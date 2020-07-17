import Realm, { ObjectSchema, Collection } from 'realm';
import { userRealmConfig } from "./userRealmConfig";
import { VariableEntity, VariableEntitySchema } from './VariableEntity';
import { appConfig } from '../app/appConfig';
import { ChildEntity } from '.';
import { ChildEntitySchema, ChildGender, Measures } from './ChildEntity';
import { DateTime } from 'luxon';
import { translateData } from '../translationsData/translateData';
import { ChartData as Data, GrowthChart0_2Type, GrowthChartHeightAgeType } from '../components/growth/growthChartData';
import { dataRealmStore } from './dataRealmStore';
import { InterpretationText } from '../screens/growth/GrowthScreen';

type Variables = {
    'userChildren': any;
    'userData': any;
    'checkedMilestones': any;
};

type VariableKey = keyof Variables;

class UserRealmStore {
    public realm?: Realm;
    private static instance: UserRealmStore;

    private constructor() {
        this.openRealm();
    }

    static getInstance(): UserRealmStore {
        if (!UserRealmStore.instance) {
            UserRealmStore.instance = new UserRealmStore();
        }
        return UserRealmStore.instance;
    }

    public async openRealm(): Promise<Realm | null> {
        return new Promise((resolve, reject) => {
            if (this.realm) {
                resolve(this.realm);
            } else {
                // Delete realm file
                if (appConfig.deleteRealmFilesBeforeOpen) {
                    Realm.deleteFile(userRealmConfig);
                }

                // Open realm file
                Realm.open(userRealmConfig)
                    .then(realm => {
                        this.realm = realm;
                        resolve(realm);
                    })
                    .catch(error => {
                        resolve(null);
                    });
            }
        });
    }

    public closeRealm() {
        if (this.realm) {
            this.realm.close();
            delete this.realm;
        }
    }

    public isRealmClosed(): boolean {
        let rval = true;

        if (this.realm) {
            rval = this.realm.isClosed;
        }

        return rval;
    }

    public getCurrentChild = () => {
        return this.realm?.objects<ChildEntity>(ChildEntitySchema.name).find((record, index) => index === 0);
    }

    public getCurrentChildAgeInDays = (birthDay?: number) => {
        let childBirthDay = birthDay ? birthDay : this.getCurrentChild()?.birthDate?.getDate();

        const timeNow = DateTime.local();
        let days: number = 0;

        if(childBirthDay){
            let date = DateTime.fromMillis(childBirthDay);
            let convertInDays = timeNow.diff(date, "days").toObject().days;

            if(convertInDays!== undefined) days = convertInDays;
        };

        return days;
    };

    public getInterpretationLenghtForAge(gender: ChildGender, lastMeasurements: Measures) {
        const childAgeId = dataRealmStore.getChildAgeTagWithArticles()?.id;

        let interpretationText: InterpretationText = {
            name: "",
            text: "",
            articleId: 0
        };

        let goodMeasure: boolean | undefined = false;

        let chartData: GrowthChartHeightAgeType = [];

        if (gender === "boy") {
            chartData = Data.Height_age_boys0_5
        } else {
            chartData = Data.Height_age_girls0_5
        }

        let length: number = 0;
        if (lastMeasurements !== undefined && lastMeasurements.weight && lastMeasurements.length) {
            length = parseFloat(lastMeasurements.length);
        };

        const childBirthDay = userRealmStore.getCurrentChild()?.birthDate;
        let measurementDate: DateTime = DateTime.local();

        if (lastMeasurements !== undefined && lastMeasurements.measurementDate) {
            measurementDate = DateTime.fromJSDate(new Date(lastMeasurements.measurementDate));
        }

        let days = 0;

        if (childBirthDay) {
            let date = DateTime.fromJSDate(childBirthDay);
            let convertInDays = measurementDate.diff(date, "days").toObject().days;


            if (convertInDays !== undefined) days = Math.round(convertInDays);
        };
        let filteredData = chartData.find(data => data.Day === days);
        let interpretationData = translateData('interpretationLenghtForAge')?.
            find(item => item.predefined_tags.indexOf(childAgeId) !== -1);


        if (filteredData !== undefined) {
            if (length >= filteredData.SD2neg && length <= filteredData.SD3) {
                interpretationText = interpretationData.goodText;
                goodMeasure = true;
            };

            if (length < filteredData.SD2neg && length > filteredData.SD3neg) {
                interpretationText = interpretationData.warrningSmallLengthText;
            };

            if (length < filteredData.SD3neg) {
                interpretationText = interpretationData.emergencySmallLengthText;
            };
            if (length > filteredData.SD3) {
                interpretationText = interpretationData.warrningBigLengthText;
            };
        };
        if(interpretationText && interpretationText.name === ""){
            goodMeasure = undefined
        }

        return {
            interpretationText: interpretationText,
            goodMeasure: goodMeasure
        };
    };

    public getInterpretationWeightForHeight(gender: ChildGender, childAgeInDays: number, lastMeasurements: Measures) {
        const dayLimit = 730; // 0-2 yeast || 2-5 years 
        const childAgeId = dataRealmStore.getChildAgeTagWithArticles()?.id;

        let interpretationText: InterpretationText = {
            name: "",
            text: "",
            articleId: 0
        };

        let goodMeasure: boolean | undefined = false;

        let chartData: GrowthChart0_2Type = [];

        if (gender === "boy") {
            if (childAgeInDays <= dayLimit) {
                chartData = Data.GrowthChartBoys0_2;
            } else {
                chartData = Data.GrowthChartBoys2_5;
            };
        } else {
            if (childAgeInDays <= dayLimit) {
                chartData = Data.GrowthChartGirls0_2;
            } else {
                chartData = Data.GrowthChartGirls2_5;
                console.log("USO")
            };
        };

        let height: number = 0;
        let length: number = 0;

        if (lastMeasurements !== undefined && lastMeasurements.weight && lastMeasurements.length) {
            height = parseFloat(lastMeasurements.weight) / 1000;
            length = parseFloat(lastMeasurements.length);
        };

        let filteredDataForHeight = chartData.find(data => data.Height === length);
        let interpretationData = translateData('interpretationWeightForHeight')?.
            find(item => item.predefined_tags.indexOf(childAgeId) !== -1);

        if (filteredDataForHeight) {
            if (height >= filteredDataForHeight?.SD2neg && height <= filteredDataForHeight.SD2) {
                interpretationText = interpretationData.goodText;
                goodMeasure = true;
            };

            if (height <= filteredDataForHeight.SD2neg && height >= filteredDataForHeight.SD3neg) {
                interpretationText = interpretationData.warrningSmallHeightText;
            };

            if (height < filteredDataForHeight.SD3neg) {
                interpretationText = interpretationData.emergencySmallHeightText;
            };

            if (height >= filteredDataForHeight.SD2 && height <= filteredDataForHeight.SD3) {
                interpretationText = interpretationData.warrningBigHeightText;
            };

            if (height > filteredDataForHeight.SD3) {
                interpretationText = interpretationData.emergencyBigHeightText;
            };
        };

        if(interpretationText && interpretationText.name === ""){
            goodMeasure = undefined
        }
        console.log(interpretationText, "IT")
        return {
            interpretationText: interpretationText,
            goodMeasure: goodMeasure,
        };
    }

    public getChildGender = () => {
        let child = this.getCurrentChild()
        return child?.gender
    }

    public async setVariable<T extends VariableKey>(key: T, value: Variables[T] | null): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                const allVariables = this.realm.objects<VariableEntity>(VariableEntitySchema.name);
                const variablesWithKey = allVariables.filtered(`key == "${key}"`);
                const keyAlreadyExists = variablesWithKey && variablesWithKey.length > 0 ? true : false;

                if (keyAlreadyExists) {
                    this.realm.write(() => {
                        variablesWithKey[0].value = JSON.stringify(value);
                        variablesWithKey[0].updatedAt = new Date();
                        resolve(true);
                    });
                }

                if (!keyAlreadyExists) {
                    this.realm.write(() => {
                        this.realm?.create<VariableEntity>(VariableEntitySchema.name, {
                            key: key,
                            value: JSON.stringify(value),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        resolve(true);
                    });
                }
            } catch (e) {
                reject();
            }
        });
    }

    // public async setMilestone(T exte)

    public getVariable<T extends VariableKey>(key: T): Variables[T] | null {
        if (!this.realm) return null;

        try {
            const allVariables = this.realm.objects<VariableEntity>(VariableEntitySchema.name);
            const variablesWithKey = allVariables.filtered(`key == "${key}"`);

            if (variablesWithKey && variablesWithKey.length > 0) {
                const record = variablesWithKey.find(obj => obj.key === key);

                if (record) {
                    return JSON.parse(record.value);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }


    public async deleteVariable<T extends VariableKey>(key: T): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                const allVariables = this.realm.objects<VariableEntity>(VariableEntitySchema.name);
                const variablesWithKey = allVariables.filtered(`key == "${key}"`);

                if (variablesWithKey && variablesWithKey.length > 0) {
                    const record = variablesWithKey.find(obj => obj.key === key);

                    this.realm.write(() => {
                        this.realm?.delete(record);
                        resolve();
                    });
                } else {
                    reject();
                }
            } catch (e) {
                reject();
            }
        });
    }

    public async create<Entity>(entitySchema: ObjectSchema, record: Entity): Promise<Entity> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                this.realm.write(() => {
                    this.realm?.create<Entity>(entitySchema.name, record);
                    resolve(record);
                });
            } catch (e) {
                reject();
            }
        });
    }

    public async delete(record: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                this.realm.write(() => {
                    this.realm?.delete(record);
                    resolve();
                });
            } catch (e) {
                reject();
            }
        });
    }

    public async deleteAll(entitySchema: ObjectSchema): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                const allRecords = this.realm?.objects(entitySchema.name);

                this.realm?.write(() => {
                    this.realm?.delete(allRecords);
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}

export const userRealmStore = UserRealmStore.getInstance();