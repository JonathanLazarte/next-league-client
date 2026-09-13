import { useDispatch } from 'react-redux';
import { useAppSelector } from './hooks';
import { useCallback } from 'react';
import {
  setActualSection,
  setIsNavigating,
  toggleSideNav,
  setQueue,
  setQueueStatus,
  setUserState,
  selectUserInterfaceData
} from '@/redux/slices/userInterfaceSlice';
import type { UserState, Queue, Section, QueueStatus } from '@/redux/slices/userInterfaceSlice'


export const useUserInterface = () => {
  const dispatch = useDispatch();
  const uiState = useAppSelector(selectUserInterfaceData);

  const changeSection = useCallback((section: Section) => {
    dispatch(setActualSection(section));
  }, [dispatch]);

  const setNavigating = useCallback((isNavigating: boolean) => {
    dispatch(setIsNavigating(isNavigating));
  }, [dispatch]);

  const updateUserState = useCallback((userState: UserState) => {
    dispatch(setUserState(userState));
  }, [dispatch]);

  const updateQueue = useCallback((queueData: Queue) => {
    dispatch(setQueue(queueData));
  }, [dispatch]);

  const updateQueueStatus = useCallback((status: QueueStatus) => {
    dispatch(setQueueStatus(status));
  }, [dispatch]);

  const updateSideNav = useCallback(() => {
    dispatch(toggleSideNav())
  }, [dispatch])

  return {
    // Estado
    ...uiState,

    // Acciones
    changeSection,
    setNavigating,
    updateUserState,
    updateQueue,
    updateQueueStatus,
    updateSideNav
  };
};
