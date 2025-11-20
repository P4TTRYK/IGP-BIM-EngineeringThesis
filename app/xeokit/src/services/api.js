import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5000'}),
    endpoints: (build) => ({
        projectModel: build.query({
            query(project) {
                return {
                    url: `/get_xkt/${project}.xkt`,
                    responseHandler: (response) => response.arrayBuffer(),
                };
            },
        }),
    }),
});

export const {
    useProjectModelQuery,
} = api;
