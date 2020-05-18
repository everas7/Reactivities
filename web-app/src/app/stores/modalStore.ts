import { RootStore } from './rootStore';
import { observable, action } from 'mobx';

export class ModalStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable.shallow modal = {
    open: false,
    body: null
  };

  @action openModal = (content: any) => {
    this.modal = {
      open: true,
      body: content
    };
  };

  @action closeModal = () => {
    this.modal = {
      open: false,
      body: null
    };
  };
}
