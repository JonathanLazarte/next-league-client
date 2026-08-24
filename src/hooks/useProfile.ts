import { setProfile } from "@/redux/slices/profileSlice";
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

export function useProfile() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  return {
    ...profile,
    profile,
    setProfile: (payload) => dispatch(setProfile(payload)),
  };
}
