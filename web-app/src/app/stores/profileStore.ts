import { RootStore } from './rootStore';
import { observable, action, runInAction, computed } from 'mobx';
import { IProfile, IPhoto, IProfileFormValues } from '../models/profile';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable updatingProfile = false;

  @computed get isCurrentUser() {
    return (
      this.profile &&
      this.rootStore.userStore.user &&
      this.profile.username === this.rootStore.userStore.user.username
    );
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      toast.error('There was a problem uplading the photo');
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos.map(p => ({
            ...p,
            isMain: p.id === photo.id
          }));
          this.rootStore.userStore.user!.image = photo.url;
          this.profile.image = photo.url;
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error('There was a problem setting the main photo');
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos.filter(
            p => p.id !== photo.id
          );
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error('There was a problem setting the main photo');
    }
  };

  @action updateProfile = async (profile: IProfileFormValues) => {
    this.updatingProfile = true;
    try {
      await agent.Profiles.update(profile);
      runInAction(() => {
        if (this.profile) {
          this.profile = {
            ...this.profile,
            ...profile,
          };
          this.rootStore.userStore.user!.displayName = profile.displayName;
        }
        this.updatingProfile = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem updating profile info');
      runInAction(() => {
        this.updatingProfile = true;
      });
    }
  };
}
