import axios, { AxiosInstance } from 'axios';

let token = '';
const storedUser = localStorage.getItem('user');
if (storedUser !== undefined && storedUser !== null) {
  console.log(storedUser)
  const user = JSON.parse(storedUser);
  token = user.token;
}

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const API_ROOT =
  process.env.NODE_ENV === 'production'
    ? '/'
    : 'http://localhost:8080/';

const userRequest: AxiosInstance = axios.create({
  baseURL: `${API_ROOT}api/user`,
});

const taskRequest: AxiosInstance = axios.create({
    baseURL: `${API_ROOT}api/task`,
  });

interface UserData {
  name: string;
  password: string;
}

interface Creator {
    creator: string;
}

interface Task {
    task: string;
}

interface Time {
    start: string;
    end: string;
}

interface CreateTask {
    task: string;
    createTime: string;
    dueTime: string;
}

interface CompleteTask {
    taskIDs: readonly number [];
}

interface Delete {
    taskIDs: readonly number [];
}

interface Update {
    task: string;
    dueTime: string;
    taskID: number;
}

export const apiUserLogin = (data: UserData): Promise<any> => userRequest.post('login', data);
export const apiGetUser = (): Promise<any> => userRequest.get('getUsers');
export const apiShowTask = (): Promise<any> => taskRequest.get('showTask');
export const apiSearchByCreator = (data: Creator): Promise<any> => taskRequest.get('searchByCreator', { params: { data } });
export const apiSearchByTask = (data: Task): Promise<any> => taskRequest.get('searchByTask', { params: { data } });
export const apiSearchByTime = (data: Time): Promise<any> => taskRequest.get('searchByTime', { params: { data } });
export const apiCreateTask = (data: CreateTask): Promise<any> => taskRequest.post('createTask', data);
export const apiCompleteTask = (data: CompleteTask): Promise<any> => taskRequest.patch('completeTask', data);
export const apiDeleteTask = (data: Delete): Promise<any> => taskRequest.delete('deleteTask', { data });
export const apiUpdateTask = (data: Update): Promise<any> => taskRequest.patch('updateTask', data);