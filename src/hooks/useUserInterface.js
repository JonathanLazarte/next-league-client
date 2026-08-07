import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  setActualSection,
  setIsNavigating,
  setQueue,
  setQueueStatus,
  setUserState,
  selectUserInterfaceData
} from '@/redux/slices/userInterfaceSlice.ts';

/**
 * Hook para gestionar el estado de la interfaz de usuario.
 * Abstrae la lógica de Redux (dispatch, selectors) para simplificar los componentes.
 */
export const useUserInterface = () => {
  const dispatch = useDispatch();
  const uiState = useSelector(selectUserInterfaceData);

  const changeSection = useCallback((section) => {
    dispatch(setActualSection(section));
  }, [dispatch]);

  const setNavigating = useCallback((isNavigating) => {
    dispatch(setIsNavigating(isNavigating));
  }, [dispatch]);

  const updateUserState = useCallback((userState) => {
    dispatch(setUserState(userState));
  }, [dispatch]);

  const updateQueue = useCallback((queueData) => {
    dispatch(setQueue(queueData));
  }, [dispatch]);

  const updateQueueStatus = useCallback((status) => {
    dispatch(setQueueStatus(status));
  }, [dispatch]);

  return {
    // Estado
    ...uiState,

    // Acciones
    changeSection,
    setNavigating,
    updateUserState,
    updateQueue,
    updateQueueStatus
  };
};
