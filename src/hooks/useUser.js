import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { setUser, setUserMessages, updateCoins, updateUser } from "@/redux/slices/userSlice";

function useUser() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const setUserData = useCallback((payload) => dispatch(setUser(payload)), [dispatch]);
  const updateUserData = useCallback((payload) => dispatch(updateUser(payload)), [dispatch]);
  const addUserMessage = useCallback((payload) => dispatch(setUserMessages(payload)), [dispatch]);
  const updateUserCoins = useCallback((payload) => dispatch(updateCoins(payload)), [dispatch]);

  return {
    ...user,
    user,
    setUser: setUserData,
    updateUser: updateUserData,
    setUserMessages: addUserMessage,
    updateCoins: updateUserCoins,
  };
}

export { useUser };
