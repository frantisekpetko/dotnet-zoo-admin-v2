import { Action, createStore, createTypedHooks, Thunk } from 'easy-peasy';
import { action, thunk } from 'easy-peasy';
import Ajax from 'src/tools/Ajax';
import { reactLocalStorage } from 'reactjs-localstorage';

export interface UserRequest {
    username: string;
    password: string;
}

export interface User {
    username: string;
}

export interface UserModel {
    accessToken: string | null;
    username: string | null;
    setUsername: Action<UserModel, string>;
    signIn: Thunk<UserModel, UserRequest>;
    userLoading: boolean;
    setUserLoading: Action<UserModel, boolean>;
    userError: any;
    setUserError: Action<UserModel, any>;
    signUp: Thunk<UserModel, UserRequest>;
    loadTokenToMemory: Action<UserModel>;
    removeTokenFromStorage: Action<UserModel>;
    saveTokenToStorage: Action<UserModel, string>;
    logOut: Action<UserModel>;
}

const user: UserModel = {
    accessToken: null,
    username: null,
    setUsername: action((state, payload) => {
        sessionStorage.setItem('username', payload);
        state.username = payload;
    }),
    signIn: thunk(async (actions, payload: UserRequest) => {
        const controller = new AbortController();

        const data = await Ajax.post('/auth/signin', payload, { signal: controller.signal });

        return {data: data, controller: controller};
    }),
    userLoading: false,
    setUserLoading: action((state, payload) => {
        state.userLoading = payload;
    }),
    userError: null,
    setUserError: action((state, payload) => {
        state.userError = payload;
    }),
    signUp: thunk(async (actions, payload: UserRequest) => {
        await Ajax.post(`auth/signup`, payload);
    }),
    loadTokenToMemory: action((state, actions) => {
        state.accessToken = sessionStorage.getItem('accessToken');
    }),
    removeTokenFromStorage: action((state, actions) => {
        sessionStorage.removeItem('accessToken');
    }),
    saveTokenToStorage: action((state, payload) => {
       
        sessionStorage.setItem('accessToken', payload);
    }),
    logOut: action((state: any, actions) => {
        state.username = '';
        sessionStorage.removeItem('accessToken');
    }),
};

export default user;
