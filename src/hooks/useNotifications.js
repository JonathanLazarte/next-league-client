import { useDispatch, useSelector } from "react-redux";
import { addNotification, markAsSeen } from "@/redux/slices/notificationsSlice";

export function useNotifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);

  return {
    ...notifications,
    notifications,
    addNotification: (payload) => dispatch(addNotification(payload)),
    markAsSeen: (payload) => dispatch(markAsSeen(payload)),
  };
}
