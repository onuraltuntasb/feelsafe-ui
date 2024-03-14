import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl:  '/api/user'
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (body) => {
                return {
                    url: '/login',
                    method: 'post',
                    body
                };
            }
        }),
        registerUser: builder.mutation({
            query: (body) => {
                return {
                    url: '/register',
                    method: 'post',
                    body
                };
            }
        }),
        forgotPassword: builder.mutation({
            query: (body) => {
                return {
                    url: '/forgot-password',
                    method: 'post',
                    body
                };
            }
        }),
        resetPassword: builder.mutation({
            query: (body) => {
                return {
                    url: '/reset-password',
                    method: 'post',
                    body
                };
            }
        })
    })
});

export const { useLoginUserMutation, useRegisterUserMutation, useForgotPasswordMutation, useResetPasswordMutation } =
    authApi;