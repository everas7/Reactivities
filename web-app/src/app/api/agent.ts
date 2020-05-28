import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivitiesEnvelope } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { IProfile, IPhoto, IProfileFormValues } from '../models/profile';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, error => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network Error - Unable to reach out the server');
  }
  const { status, data, config, headers } = error.response;
  if (status === 404) {
    history.push('/notfound');
  }

  if (
    status === 401 &&
    headers['www-authenticate']?.includes(`Bearer error="invalid_token"`)
  ) {
    window.localStorage.removeItem('jwt');
    history.push('/');
    toast.info('Your session has expired, please login again');
  }
  if (
    status === 400 &&
    config.method === 'get' &&
    data.errors.hasOwnProperty('id')
  ) {
    history.push('/notfound');
  }
  if (status === 500) {
    toast.error('Server Error - Contact system administrator');
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const request = {
  get: (url: string, params?: URLSearchParams) =>
    axios
      .get(url, { params })
      .then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body)
      .then(responseBody),
  put: (url: string, body: {}) =>
    axios
      .put(url, body)
      .then(responseBody),
  del: (url: string) =>
    axios
      .delete(url)
      .then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios
      .post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(responseBody);
  }
};

const Activities = {
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> =>
    request.get('/activities', params),
  details: (id: string): Promise<IActivity> => request.get(`/activities/${id}`),
  create: (activity: IActivity) => request.post('/activities', activity),
  update: (activity: IActivity) =>
    request.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.del(`/activities/${id}`),
  attend: (id: string) => request.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => request.del(`/activities/${id}/attend`)
};

const User = {
  current: (): Promise<IUser> => request.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> =>
    request.post('user/login', user),
  register: (user: IUserFormValues): Promise<IUser> =>
    request.post('user/register', user)
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    request.get(`/profiles/${username}`),
  update: (profile: IProfileFormValues) => request.put('/profiles', profile),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    request.postForm(`/photos/`, photo),
  setMainPhoto: (id: string) => request.post(`/photos/${id}/setmain`, {}),
  deletePhoto: (id: string) => request.del(`/photos/${id}`),
  follow: (username: string) =>
    request.post(`/profiles/${username}/follow`, {}),
  unfollow: (username: string) => request.del(`/profiles/${username}/follow`),
  listFollowers: (username: string) =>
    request.get(`/profiles/${username}/followers`),
  listFollowings: (username: string) =>
    request.get(`/profiles/${username}/followings`),
  listActivities: (username: string, predicate?: string) =>
    request.get(`/profiles/${username}/activities?predicate=${predicate}`)
};

export default {
  Activities,
  User,
  Profiles
};
