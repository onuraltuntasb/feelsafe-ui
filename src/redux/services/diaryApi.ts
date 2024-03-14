import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const diaryApi = createApi({
    reducerPath: 'diaryApi',
    baseQuery: fetchBaseQuery({
        baseUrl:  '/api/diary'
    }),
    endpoints: (builder) => ({
        addDiary: builder.mutation({
            query: (body) => {
                return {
                    url: '/save',
                    method: 'post',
                    body
                };
            }
        }),
        updateDiary: builder.mutation({
            query: (body) => {
                return {
                    url: '/update',
                    method: 'put',
                    body
                };
            }
        }),
        deleteDiary: builder.mutation({
            query: (body) => {
                return {
                    url: '/delete',
                    method: 'delete',
                    body
                };
            }
        }),
        getAllDiariesUsers: builder.query({
            query: () => '/get-all-users',
        }),
       
    })
});

export const { useAddDiaryMutation,useLazyGetAllDiariesUsersQuery,useUpdateDiaryMutation ,useDeleteDiaryMutation} =
diaryApi;