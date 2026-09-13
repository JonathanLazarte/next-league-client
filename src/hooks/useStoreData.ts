import { useDispatch } from "react-redux";
import { useAppSelector } from '@/hooks/hooks'
import { addToCart, setFeaturedItems } from "@/redux/slices/storeSlice";

export function useStoreData() {
  const dispatch = useDispatch();
  const storeData = useAppSelector((state) => state.storeData);

  return {
    ...storeData,
    storeData,
    setFeaturedItems: (payload: string[]) => dispatch(setFeaturedItems(payload)),
    addToCart: (payload: string) => dispatch(addToCart(payload)),
  };
}
