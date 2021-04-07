import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OcProductListOptions, setListOptions } from "../redux/ocProductList";
import { OcDispatch, OcRootState } from "../redux/ocStore";

const useOcProductList = (options: OcProductListOptions) => {
  const dispatch = useDispatch<OcDispatch>();

  const { products, isAuthenticated } = useSelector((state: OcRootState) => ({
    isAuthenticated: state.ocAuth.isAuthenticated,
    products: state.ocProductList.items,
  }));

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setListOptions(options));
    }
  }, [options, isAuthenticated]);

  return products;
};

export default useOcProductList;
