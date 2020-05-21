import { observable, action, computed, runInAction } from 'mobx';
import { IActivity, IAttendee } from '../models/activity';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { IUser } from '../models/user';

export class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map<string, IActivity>();
  @observable activity: IActivity | null = null;
  @observable loadingActivities = false;
  @observable submitting = false;
  @observable target = '';
  @observable loading = false;

  @computed get activitiesByDate(): [string, IActivity[]][] {
    const activitiesArray = Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const groupByDate = (
      activitites: { [key: string]: IActivity[] },
      currentActivity: IActivity
    ) => {
      const date = currentActivity.date.toISOString().split('T')[0];
      return {
        ...activitites,
        [date]: [...(activitites[date] || []), currentActivity]
      };
    };

    return Object.entries(activitiesArray.reduce(groupByDate, {}));
  }

  @action loadActivities = async () => {
    this.loadingActivities = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          this.setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingActivities = false;
      });
    } catch (error) {
      runInAction('loading activities error', () => {
        this.loadingActivities = false;
      });
      console.log(error);
    }
  };

  setActivityProps = (activity: IActivity, user: IUser) => {
    activity.date = new Date(activity.date);
    activity.isGoing = activity.attendees.some(
      a => a.username === user.username
    );
    activity.isHost = activity.attendees.some(
      a => a.username === user.username && a.isHost
    );
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return { ...activity };
    } else {
      this.loadingActivities = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          this.setActivityProps(activity!, this.rootStore.userStore.user!);
          this.activity = activity!;
          this.loadingActivities = false;
          this.activityRegistry.set(activity!.id, activity!);
        });
        return { ...activity };
      } catch (error) {
        runInAction('getting activity error', () => {
          this.loadingActivities = false;
        });
        console.log(error);
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      console.log(activity, 'veamos');
      await agent.Activities.create(activity);
      const attendee = this.mapUserToAttendee(this.rootStore.userStore.user!);
      activity.isHost = true;
      activity.isGoing = true;
      attendee.isHost = true;
      const attendees = [attendee];
      activity.attendees = attendees;
      runInAction('creating activities', () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction('creating activities error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('editing activities', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction('editing activities error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('deleting activities', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('deleting activities error', () => {
        this.submitting = false;
        this.target = '';
      });
      console.log(error);
    }
  };

  @action attendActivity = async () => {
    const attendee = this.mapUserToAttendee(this.rootStore.userStore.user!);
    try {
      this.loading = true;
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error('Problem signing up to the activity');
      console.log(error);
    }
  };

  @action cancelAttendance = async () => {
    try {
      this.loading = true;
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.log(error);
      toast.error('Problem signing out of the activity');
    }
  };

  mapUserToAttendee = (user: IUser): IAttendee => {
    return {
      displayName: user.displayName,
      username: user.username,
      image: user.image || null,
      isHost: false
    };
  };
}
