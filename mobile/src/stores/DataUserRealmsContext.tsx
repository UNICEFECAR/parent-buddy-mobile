import React from 'react';
import { debounce } from 'lodash';
import { dataRealmStore } from './dataRealmStore';
import { DataRealmConsumer, DataRealmContextValue } from './DataRealmContext';
import { UserRealmConsumer, UserRealmContextValue } from './UserRealmContext';

export interface DataUserRealmsContextValue {
    dataRealm: Realm | null;
    userRealm: Realm | null;
}

interface DataUserRealmsProviderState {
    
}

export const DataUserRealmsContext = React.createContext<DataUserRealmsContextValue>({} as DataUserRealmsContextValue);

export class DataUserRealmsProvider extends React.PureComponent<object, DataUserRealmsProviderState> {
    public state: Readonly<DataUserRealmsProviderState> = {
        
    };

    constructor(props: object) {
        super(props);
        this.getContextValue = debounce(this.getContextValue.bind(this), 500);
    }

    private getContextValue(dataRealm: Realm | null, userRealm: Realm | null): DataUserRealmsContextValue {
        return {dataRealm, userRealm};
    }

    public render() {
        return (
            <DataRealmConsumer>
                {(dataRealmContext: DataRealmContextValue) => (
                    <UserRealmConsumer>
                        {(userRealmContext: UserRealmContextValue) => (
                            <DataUserRealmsContext.Provider value={this.getContextValue(dataRealmContext.realm, userRealmContext.realm)}>{this.props.children}</DataUserRealmsContext.Provider>
                        )}
                    </UserRealmConsumer>
                )}
            </DataRealmConsumer>
        );
    }
}

export const DataUserRealmsConsumer = DataUserRealmsContext.Consumer;