import React from 'react';
import Realm from 'realm';
import { dataRealmConfig } from "../stores/dataRealmConfig";

export interface DataRealmContextValue {
    realm: Realm | null;
}

interface DataRealmProviderState {
    realm: Realm | null;
}

export const DataRealmContext = React.createContext<DataRealmContextValue>( {} as DataRealmContextValue );

export class DataRealmProvider extends React.Component<object, DataRealmProviderState> {
    public state: Readonly<DataRealmProviderState> = {
        realm: null
    };

    constructor(props: object) {
        super(props);
        this.onRealmChange = this.onRealmChange.bind(this);
        this.openRealm();
    }

    private openRealm() {
        Realm.open(dataRealmConfig)
            .then(realm => {
                this.setState({realm});
                realm.addListener('change', this.onRealmChange);
            })
            .catch(error => {
                console.warn(error);
            });
    }

    private onRealmChange() {
        this.forceUpdate();
    }

    public componentWillUnmount() {
        if (this.state.realm) {
            this.state.realm.removeListener('change', this.onRealmChange);
            
            if (!this.state.realm.isClosed) {
                this.state.realm.close();
            }
        }
    }

    public render() {
        const contextValue: DataRealmContextValue = {
            realm: this.state.realm,
        };

        return (
            <DataRealmContext.Provider value={contextValue}>{this.props.children}</DataRealmContext.Provider>
        );
    }
}

export const DataRealmConsumer = DataRealmContext.Consumer;