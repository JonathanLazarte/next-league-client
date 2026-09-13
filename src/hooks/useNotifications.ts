import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { addNotification, markAsSeen } from "@/redux/slices/notificationsSlice";
import { Notification } from "@/redux/slices/notificationsSlice"

export function useNotifications() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);

  return {
    ...notifications,
    notifications,
    addNotification: (payload: Notification) => dispatch(addNotification(payload)),
    markAsSeen: (payload: string) => dispatch(markAsSeen(payload)),
  };
}
