import React from 'react';
import Realm from 'realm';

export interface DataRealmContextValue {
    realm: Realm | null,
    setRealm: (realm:Realm | null)=>void
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
    }

    private setRealm(realm:Realm | null) {
        this.setState((state:DataRealmProviderState) => {
            return {
                realm: realm
            };
        });
    };

    public render() {
        const contextValue: DataRealmContextValue = {
            realm: this.state.realm,
            setRealm: this.setRealm.bind(this),
        };

        return (
            <DataRealmContext.Provider value={contextValue}>{this.props.children}</DataRealmContext.Provider>
        );
    }
}

export const DataRealmConsumer = DataRealmContext.Consumer;