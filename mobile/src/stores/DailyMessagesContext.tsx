import React from 'react';
import Realm from 'realm';
import { dataRealmStore } from './dataRealmStore';

export interface DailyMessagesContextValue {
    realm: Realm | null;
}

interface DailyMessagesProviderState {
    realm: Realm | null;
}

export const DailyMessagesContext = React.createContext<DailyMessagesContextValue>( {} as DailyMessagesContextValue );

export class DailyMessagesProvider extends React.PureComponent<object, DailyMessagesProviderState> {
    public state: Readonly<DailyMessagesProviderState> = {
        realm: null
    };

    constructor(props: object) {
        super(props);
        this.onRealmChange = this.onRealmChange.bind(this);
        this.openRealm();
    }

    private async openRealm() {
        if (realm) {
            this.setState({realm});
            realm.addListener('change', this.onRealmChange);
        } else {
            console.warn('DailyMessagesProvider was not able to open realm');
        }
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
        const contextValue: DailyMessagesContextValue = {
            realm: this.state.realm,
        };

        return (
            <DailyMessagesContext.Provider value={contextValue}>{this.props.children}</DailyMessagesContext.Provider>
        );
    }
}

export const DataRealmConsumer = DailyMessagesContext.Consumer;