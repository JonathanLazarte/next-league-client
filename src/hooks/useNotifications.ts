import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { addNotification, markAsSeen } from "@/redux/slices/notificationsSlice";

export function useNotifications() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);

  return {
    ...notifications,
    notifications,
    addNotification: (payload) => dispatch(addNotification(payload)),
    markAsSeen: (payload) => dispatch(markAsSeen(payload)),
  };
}
