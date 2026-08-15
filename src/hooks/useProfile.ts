import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "@/redux/slices/profileSlice";

export function useProfile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  return {
    ...profile,
    profile,
    setProfile: (payload) => dispatch(setProfile(payload)),
  };
}
