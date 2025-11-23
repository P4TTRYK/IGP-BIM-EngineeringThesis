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
        projectList: build.query({
            query() {
                return {
                    url: '/projects',
                };
            }
        }),
        projectSurvey: build.query({
            query(project) {
                return {
                    url: `/project/${project}/changes`,
                };
            }
        }),
        updateSurvey: build.mutation({
            query({project, formSurveyData}) {
                return {
                    url: `/project/${project}/changes`,
                    method: 'POST',
                    body: formSurveyData,
                };
            },
        })
    }),
});

export const {
    useProjectModelQuery,
    useProjectListQuery,
    useProjectSurveyQuery,
    useUpdateSurveyMutation,
} = api;
