import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import championsReducer from './slices/userChampionsSlice';
import skinsReducer from './slices/userSkinsSlice';
import interfaceReducer from './slices/userInterfaceSlice';
import authReducer from './slices/authSlice';
import soundReducer from './slices/soundSlice';
import settingsReducer from './slices/settingsSlice';
import purchaseReducer from './slices/purchaseSlice';

//TODO: navigationSlice

import connectedUsersReducer from './slices/connectedUsersSlice';
import chatReducer from './slices/chatSlice';
import profileReducer from './slices/profileSlice';
import storeReducer from './slices/storeSlice';
import matchmakingReducer from './slices/matchmakingSlice';
import notificationsReducer from './slices/notificationsSlice';
import tooltipReducer from './slices/tooltipSlice'


const store = configureStore({
  reducer: {
    user: userReducer,
    userChampions: championsReducer,
    userSkins: skinsReducer,
    userInterface: interfaceReducer,
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
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>

export default store;
