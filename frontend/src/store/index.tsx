import { createStore, createTypedHooks } from 'easy-peasy';
import user from './models/user';
import animal from './models/animal';
import { UserModel } from 'src/store/models/user';
import { AnimalModel } from './models/animal';

interface StoreModel {
    user: UserModel;
    animal: AnimalModel;
}

const model: StoreModel = {
    user,
    animal,
};

const store = createStore(model);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export default store;
