import { observable, action, computed, runInAction } from 'mobx';
import { IActivity } from '../models/activity';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import {history} from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';

export class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  };

  @observable activityRegistry = new Map<string, IActivity>();
  @observable activity: IActivity | null = null;
  @observable loadingActivities = false;
  @observable submitting = false;
  @observable target = '';

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
          activity.date = new Date(activity.date);
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

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return {...activity};
    } else {
      this.loadingActivities = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          activity!.date = new Date(activity!.date);
          this.activity = activity!;
          this.loadingActivities = false;
          this.activityRegistry.set(activity!.id, activity!);
        });
        return {...activity};
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
      await agent.Activities.create(activity);
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
}
