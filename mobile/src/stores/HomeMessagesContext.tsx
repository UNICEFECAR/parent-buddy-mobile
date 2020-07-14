import React from 'react';
import { debounce } from 'lodash';
import { dataRealmStore } from './dataRealmStore';
import { DataRealmConsumer, DataRealmContextValue } from './DataRealmContext';
import { UserRealmConsumer, UserRealmContextValue } from './UserRealmContext';

export interface HomeMessagesContextValue {
    dataRealm: Realm | null;
    userRealm: Realm | null;
}

interface HomeMessagesProviderState {
    
}

export const HomeMessagesContext = React.createContext<HomeMessagesContextValue>({} as HomeMessagesContextValue);

export class HomeMessagesProvider extends React.PureComponent<object, HomeMessagesProviderState> {
    public state: Readonly<HomeMessagesProviderState> = {
        
    };

    constructor(props: object) {
        super(props);
        this.getContextValue = debounce(this.getContextValue.bind(this), 500);
    }

    private getContextValue(dataRealm: Realm | null, userRealm: Realm | null): HomeMessagesContextValue {
        return {dataRealm, userRealm};
    }

    public render() {
        return (
            <DataRealmConsumer>
                {(dataRealmContext: DataRealmContextValue) => (
                    <UserRealmConsumer>
                        {(userRealmContext: UserRealmContextValue) => (
                            <HomeMessagesContext.Provider value={this.getContextValue(dataRealmContext.realm, userRealmContext.realm)}>{this.props.children}</HomeMessagesContext.Provider>
                        )}
                    </UserRealmConsumer>
                )}
            </DataRealmConsumer>
        );
    }
}

export const HomeMessagesConsumer = HomeMessagesContext.Consumer;