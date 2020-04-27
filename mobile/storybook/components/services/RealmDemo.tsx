import React, { Fragment } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from 'react-native-paper';
import Realm from 'realm';

import { dataRealmConfig } from "../../../src/stores/dataRealmConfig";
import { ArticleEntity, ArticleEntitySchema } from "../../../src/stores/ArticleEntity";
import { DataRealmContext, DataRealmContextValue, DataRealmConsumer } from '../../../src/stores/DataRealmContext';

const EXTERNAL_ID = 44444401;

export class RealmDemo extends React.Component<object> {
    private realm: Realm | null;

    public constructor(props: object) {
        super(props);

        this.realm = null;
        this.openRealm();
    }

    private openRealm() {
        Realm.open(dataRealmConfig)
            .then(realm => {
                this.realm = realm;
            })
            .catch(error => {
                console.warn(error);
            });
    }

    private closeRealm() {
        if (this.realm && !this.realm.isClosed) {
            this.realm.close();
        }
    }

    private getPath() {
        if (!this.realm) return;

        console.warn(this.realm.path);
    }

    private createArticle() {
        try {
            this.realm?.write(() => {
                const record = this.realm?.create<ArticleEntity>(ArticleEntitySchema.name, {
                    externalId: EXTERNAL_ID,
                    title: 'Test Article 01',
                    bodyHTML: 'Enim ad aliquip tempor voluptate eiusmod est Lorem commodo id fugiat elit duis. Sit laborum anim pariatur fugiat reprehenderit dolore. Cillum culpa enim irure elit voluptate sit ex occaecat fugiat.',
                    categoryId: 12,
                    coverImageUrl: 'https://terrigen-cdn-dev.marvel.com/content/prod/1x/002irm_ons_mas_mob_01_0.jpg',
                });

                // console.warn(JSON.stringify(record, null, 4));
            });
        } catch (e) {
            console.warn(e);
        }
    }

    private readArticle() {
        try {
            let allRecords = this.realm?.objects<ArticleEntity>(ArticleEntitySchema.name);
            let filteredRecords = allRecords?.filtered(`externalId = ${EXTERNAL_ID}`);

            filteredRecords?.forEach((record, index, collection) => {
                console.warn(JSON.stringify(record, null, 4));
            });
        } catch (e) {
            console.warn(e);
        }
    }

    private editArticle() {
        try {
            let allRecords = this.realm?.objects<ArticleEntity>(ArticleEntitySchema.name);
            let filteredRecords = allRecords?.filtered(`externalId = ${EXTERNAL_ID}`);

            filteredRecords?.forEach((record, index, collection) => {
                this.realm?.write(() => {
                    record.title += ' EDITED';
                });
            });
        } catch (e) {
            console.warn(e);
        }
    }

    private deleteArticle() {
        try {
            let allRecords = this.realm?.objects<ArticleEntity>(ArticleEntitySchema.name);
            let filteredRecords = allRecords?.filtered(`externalId = ${EXTERNAL_ID}`);

            let deleteRecord: ArticleEntity & Realm.Object | null = null;
            filteredRecords?.forEach((record, index, collection) => {
                deleteRecord = record;
            });

            if (deleteRecord) {
                this.realm?.write(() => {
                    this.realm?.delete(deleteRecord);
                });
            }
        } catch (e) {
            console.warn(e);
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
                <Typography type={TypographyType.headingSecondary}>
                    Realm
                </Typography>

                {/* BUTTONS */}
                <Button mode="contained" uppercase={false} onPress={() => { this.getPath() }} color={Colors.blue700}>
                    Get path
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={() => { this.createArticle() }} color={Colors.blue700}>
                    Create article
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={() => { this.readArticle() }} color={Colors.blue700}>
                    Read article
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={() => { this.editArticle() }} color={Colors.blue700}>
                    Edit article
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={() => { this.deleteArticle() }} color={Colors.blue700}>
                    Delete article
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={() => { this.closeRealm() }} color={Colors.red700}>
                    Close realm
                </Button>
                <View style={{ height: scale(10) }} />

                {/* SHOW REALM RECORDS */}
                <DataRealmConsumer>
                    {(dataRealmContext: DataRealmContextValue) => (
                        <Fragment>
                            {!dataRealmContext.realm?.isClosed && dataRealmContext.realm?.empty ? (
                                <Text>
                                    No records
                                </Text>
                            ) : !dataRealmContext.realm?.isClosed && dataRealmContext.realm?.objects<ArticleEntity>(ArticleEntitySchema.name)
                                .filtered(`externalId = ${EXTERNAL_ID}`).map(record => {
                                    let recordCopy = {title:record.title};

                                    return (
                                        <RealmItem record={recordCopy} />
                                    );
                                })
                            }
                        </Fragment>
                    )}
                </DataRealmConsumer>
            </ScrollView>
        );
    }
}

interface RealmItemProps {
    record: {title:string}
}

class RealmItem extends React.Component<RealmItemProps> {
    public shouldComponentUpdate(nextProps:RealmItemProps): boolean {
        if (nextProps.record.title !== this.props.record.title) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        // console.warn('aaa');

        return (
            <Text>
                {this.props.record.title}
            </Text>
        );
    }
}