import { RootStore } from './rootStore';
import { observable, action, runInAction, computed, reaction } from 'mobx';
import { IProfile, IPhoto, IProfileFormValues, IUserActivity } from '../models/profile';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      activeTab => {
        this.followings = [];

        if (activeTab === 3) this.loadFollowers();

        if (activeTab === 4) this.loadFollowings();

      }
    );

    reaction(
      () => this.profile && this.profile.followersCount,
      () => {
        this.loadFollowers();
      }
    );
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable updatingProfile = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 1;
  @observable userActivities: IUserActivity[] = [];
  @observable loadingActivities = false;

  @action loadUserActivities = async (username: string, predicate?: string) => {
    this.loadingActivities = true;
    try {
      const activities = await agent.Profiles.listActivities(username, predicate);
      runInAction(() => {
        this.userActivities = activities;
        this.loadingActivities = false;
      });
    } catch (error) {
      toast.error('Problem loading user activities');
      runInAction(() => {
        this.loadingActivities = false;
      })
    }
  };

  @action setActiveTab = (tabIndex: number) => {
    this.activeTab = tabIndex;
  };

  @computed get isCurrentUser() {
    return !!(
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
            ...profile
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

  @action followProfile = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profiles.follow(username);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount += 1;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem following user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unfollowProfile = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profiles.unfollow(username);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount -= 1;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem unfollowing user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowings = async () => {
    this.loading = true;
    try {
      const profiles = await agent.Profiles.listFollowings(
        this.profile!.username
      );
      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem loading followings');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowers = async () => {
    this.loading = true;
    try {
      const profiles = await agent.Profiles.listFollowers(
        this.profile!.username
      );
      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem loading followings');
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
