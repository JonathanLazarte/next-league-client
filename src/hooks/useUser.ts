import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { fetchUser, setUserMessages, updateCoins, updateUser } from "@/redux/slices/userSlice";

function useUser() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user, shallowEqual);

  const fetchUserData = useCallback((payload) => dispatch(fetchUser(payload)), [dispatch]);
  const updateUserData = useCallback((payload) => dispatch(updateUser(payload)), [dispatch]);
  const addUserMessage = useCallback((payload) => dispatch(setUserMessages(payload)), [dispatch]);
  const updateUserCoins = useCallback((payload) => dispatch(updateCoins(payload)), [dispatch]);

  return {
    ...user,
    user,
    fetchUser: fetchUserData,
    updateUser: updateUserData,
    setUserMessages: addUserMessage,
    updateCoins: updateUserCoins,
  };
}

export { useUser };
