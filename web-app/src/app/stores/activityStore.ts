import { observable, action, computed, runInAction, reaction } from 'mobx';
import { IActivity, IAttendee } from '../models/activity';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { IUser } from '../models/user';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from '@microsoft/signalr';

const PER_PAGE = 2;

export class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 1;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );

    reaction(
      () => this.predicate.get('startDate'),
      () => {
        this.page = 1;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );
  }

  @observable activityRegistry = new Map<string, IActivity>();
  @observable activity: IActivity | null = null;
  @observable activityCount: number = 0;
  @observable loadingActivities = false;
  @observable submitting = false;
  @observable target = '';
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable page: number = 1;
  @observable predicate = new Map();

  @action setPredicate = (predicate: string, value: string | Date) => {
    let date = this.predicate.get('startDate') || undefined;
    if (predicate !== 'startDate') {
      this.predicate.clear();
      if (date && predicate !== 'all') this.predicate.set('startDate', date);
    }

    if (predicate !== 'all') this.predicate.set(predicate, value);
    console.log(this.predicate.keys(), 'valores');
  };

  @computed get axiosParams(): URLSearchParams {
    const params = new URLSearchParams();
    params.append('page', String(this.page));
    params.append('perPage', String(PER_PAGE));
    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  @computed get totalPages(): number {
    return Math.ceil(this.activityCount / PER_PAGE);
  }

  @action setPage = (page: number) => {
    this.page = page;
  };

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/chat', {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(() => {
        console.log('Attempting to join group');
        this.hubConnection!.invoke('AddToGroup', activityId);
      })
      .catch(error =>
        console.log('Error establishing hub connection: ', error)
      );

    this.hubConnection.on('ReceiveComment', comment => {
      runInAction(() => {
        this.activity!.comments.push(comment);
      });
    });

    this.hubConnection.on('Send', message => {
      toast.info(message);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
      .then(() => {
        this.hubConnection!.stop();
      })
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log(err));
  };

  @action addComment = async (values: any) => {
    values.activityId = this.activity!.id;
    try {
      await this.hubConnection!.invoke('SendComment', values);
    } catch (error) {
      console.log(error);
    }
  };

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
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      const { activities, activityCount } = activitiesEnvelope;
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          this.setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
          this.activityCount = activityCount;
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
      activity.comments = [];
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
