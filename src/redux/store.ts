import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../redux/features/authSlice';
import diaryReducer from '../redux/features/diarySlice';

import { authApi } from './services/authApi';
import { diaryApi } from './services/diaryApi';

export const store = configureStore({
  reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      diary: diaryReducer,
      [diaryApi.reducerPath]: diaryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
          .concat(authApi.middleware)
          .concat(diaryApi.middleware)
        
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch