import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://127.0.0.1:5000'}),
    endpoints: (build) => ({
        projectModel: build.query({
            query(project) {
                return {
                    url: `/get_xkt/${project}.xkt`,
                    responseHandler: (response) => response.arrayBuffer(),
                };
            },
        }),
        projectList : build.query({
            query(){
                return {
                    url: '/projects',
                }; 
            } 
        }),
    }),
});

export const {
    useProjectModelQuery,
    useProjectListQuery,
} = api;