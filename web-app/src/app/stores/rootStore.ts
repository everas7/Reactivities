import {UserStore} from './userStore';
import {ActivityStore} from './activityStore';
import {CommonStore} from './commonStore';
import { createContext } from 'react';
import { configure } from 'mobx';
import {ModalStore} from './modalStore';

configure({ enforceActions: 'always' });

export class RootStore {
  commonStore: CommonStore;
  userStore: UserStore;
  activityStore: ActivityStore;
  modalStore: ModalStore;

  constructor(){
    this.commonStore = new CommonStore(this);    
    this.userStore = new UserStore(this);
    this.activityStore = new ActivityStore(this);
    this.modalStore = new ModalStore(this);
  };
}

export const RootStoreContext = createContext(new RootStore());
