import { useDispatch, useSelector } from "react-redux";
import { addToCart, setFeaturedItems } from "@/redux/slices/storeSlice";

export function useStoreData() {
  const dispatch = useDispatch();
  const storeData = useSelector((state) => state.storeData);

  return {
    ...storeData,
    storeData,
    addToCart: (payload) => dispatch(addToCart(payload)),
    setFeaturedItems: (payload) => dispatch(setFeaturedItems(payload)),
  };
}
