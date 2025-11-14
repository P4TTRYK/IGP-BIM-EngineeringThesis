import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {api} from './services/api.js'

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['api/executeQuery/fulfilled'],
                ignoredPaths: ['api.queries'],
            },
        }).concat(api.middleware),
})

setupListeners(store.dispatch);
