import { Action, Thunk, action, thunk } from 'easy-peasy';
import Ajax from 'src/tools/Ajax';

interface Animal {
    id: number;
    name: string;
    latinname: string;
    images: Image[];
    createdAt: string;
    updatedAt: string;
}

export interface AnimalDetail {
    id?: number;
    name?: string;
    latinname?: string;
    description?: string;
    extlinks: Extlinks[];
    images: Image[];
    createdAt?: string;
    updatedAt?: string;
}

interface AnimalUpdate {
    id?: number;
    name?: string;
    latinname?: string;
    description?: string;
    extlinks?: string[];
    images: Image[];
    createdAt?: string;
    updatedAt?: string;
}

interface Image {
    id?: number;
    urlName?: string;
}

interface Extlinks {
    id: number;
    link: string;
}



export interface AnimalModel {
    page: number;
    setPage: Action<AnimalModel, number>;
    limit: number;
    setLimit: Action<AnimalModel, number>;
    search: string;
    setSearch: Action<AnimalModel, string>;
    pages: number | null;
    setPages: Action<AnimalModel, number>;
    getPages: Thunk<AnimalModel, { limit: number; search: string }>;
    animals: Animal[];
    animal: AnimalDetail | null;
    getAnimals: Thunk<AnimalModel, { page: number; limit: number; search: string }>;
    setAnimals: Action<AnimalModel, Animal[]>;
    getAnimal: Thunk<AnimalModel, string | undefined>;
    setAnimal: Action<AnimalModel, AnimalDetail>;
    addAnimal: Action<AnimalModel, Animal>;
    saveAnimal: Thunk<AnimalModel, any>;
    loading: boolean;
    setLoading: Action<AnimalModel, boolean>;
    error: unknown;
    setError: Action<AnimalModel, unknown>;
    deleteAnimal: Thunk<AnimalModel, { id: number }>;
    updateAnimal: Thunk<AnimalModel, { id: number, data: any }>;
    getUpdateAnimal: Thunk<AnimalModel, string | undefined>;
    setUpdateAnimal: Action<AnimalModel, AnimalUpdate>;
    animalUpdate: AnimalUpdate | null;

}

const animal: AnimalModel = {
    page: 1,
    setPage: action((state, payload) => {
        state.page = payload;
    }),
    limit: 12,
    setLimit: action((state, payload) => {
        state.limit = payload;
    }),
    search: '',
    setSearch: action((state, payload) => {
        state.search = payload;
    }),
    pages: null,
    setPages: action((state, payload) => {
        state.pages = payload;
    }),
    getPages: thunk(async (actions, payload) => {
        const { data } = await Ajax.get('/animals/pages', {
            params: {
                limit: payload.limit,
                search: payload.search
            },
        });
        actions.setPages(data);
    }),
    animals: [],
    animal: null,
    animalUpdate: null,
    getAnimals: thunk(async (actions, payload) => {
        const { data } = await Ajax.get('/animals', {
            params: {
                page: payload.page,
                limit: payload.limit,
                search: payload.search
            },
        });
        actions.setAnimals(data);
        console.log('animals', data)
        return data;
    }),
    setUpdateAnimal: action((state, payload) => {
        state.animalUpdate = payload;
    }),
    getUpdateAnimal: thunk(async (actions, payload) => {
        const { data }: any = await Ajax.get(`animals/${payload}`);
        const extlinks:string[] = data?.extlinks?.map(item => {
            return item.link
        });
        delete data.extlinks;
        data.extlinks = [...extlinks];
        actions.setUpdateAnimal(data);
    }),
    setAnimals: action((state, payload) => {
        state.animals = [...payload];
    }),
    getAnimal: thunk(async (actions, payload) => {
        const { data } = await Ajax.get(`animals/${payload}`);
        actions.setAnimal(data);
    }),
    setAnimal: action((state, payload) => {
        state.animal = payload;
    }),
    addAnimal: action((state, payload) => {
        console.log('payload', payload, 'xxxxxxxxxxxxxxxxxxxxxx');
        state.animals = [...state.animals, payload];
    }),
    saveAnimal: thunk(async (actions, payload) => {
        try {
            actions.setLoading(true);
            const { data } = await Ajax.post('/animals', payload);
            console.log('data', data);
            //actions.addAnimal(data);
            actions.setLoading(false);
        } catch (e) {
            console.log('error', e);
            actions.setError(e);
        }
    }),
    loading: false,
    setLoading: action((state, payload) => {
        state.loading = payload;
    }),
    error: null,
    setError: action((state, payload) => {
        state.error = payload;
    }),
    deleteAnimal: thunk(async (actions, payload) => {
        try {
            console.log('payload', payload);
            actions.setLoading(true);
            await Ajax.delete(`/animals/${payload}`);
            actions.setLoading(false);
        } catch (e) {
            console.log('error', e);
            actions.setError(e);
        }
    }),
    updateAnimal: thunk(async (actions, payload) => {
        try {
            console.log('payload', payload);
            actions.setLoading(true);
            await Ajax.patch(`/animals/${payload.id}`, payload.data);
            actions.setLoading(false);
        } catch (e) {
            console.log('error', e);
            actions.setError(e);
        }
    }),
};

export default animal;
//