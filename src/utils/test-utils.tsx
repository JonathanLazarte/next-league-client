import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import authReducer from '@/redux/slices/authSlice';
import userReducer from '@/redux/slices/userSlice';
import userInterfaceReducer from '@/redux/slices/userInterfaceSlice';
import soundReducer from '@/redux/slices/soundSlice';
import settingsReducer from '@/redux/slices/settingsSlice';
import purchaseReducer from '@/redux/slices/purchaseSlice';
import championsReducer from '@/redux/slices/userChampionsSlice';
import skinsReducer from '@/redux/slices/userSkinsSlice';
import connectedUsersReducer from '@/redux/slices/connectedUsersSlice';
import chatReducer from '@/redux/slices/chatSlice';
import profileReducer from '@/redux/slices/profileSlice';
import storeReducer from '@/redux/slices/storeSlice';
import matchmakingReducer from '@/redux/slices/matchmakingSlice';
import notificationsReducer from '@/redux/slices/notificationsSlice';
import tooltipReducer from '@/redux/slices/tooltipSlice';
import type { RootState } from '@/redux/store';

export interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore;
  queryClient?: QueryClient;
}

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

export const setupTestStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: {
      user: userReducer,
      userChampions: championsReducer,
      userSkins: skinsReducer,
      userInterface: userInterfaceReducer,
      auth: authReducer,
      sound: soundReducer,
      settings: settingsReducer,
      purchase: purchaseReducer,
      tooltip: tooltipReducer,
      connectedUsers: connectedUsersReducer,
      chat: chatReducer,
      profile: profileReducer,
      storeData: storeReducer,
      matchmaking: matchmakingReducer,
      notifications: notificationsReducer,
    },
    preloadedState: preloadedState as any,
  });

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupTestStore(preloadedState),
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  }

  return { store, queryClient, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
