import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProductId } from "../redux/ocProductDetail";
import { OcDispatch, OcRootState } from "../redux/ocStore";

const useOcProductDetail = (productId: string) => {
  const dispatch = useDispatch<OcDispatch>();

  const { product, specs, variants, isAuthenticated } = useSelector(
    (state: OcRootState) => ({
      product: state.ocProductDetail.product,
      specs: state.ocProductDetail.specs,
      variants: state.ocProductDetail.variants,
      isAuthenticated: state.ocAuth.isAuthenticated,
    })
  );

  useEffect(() => {
    if (productId && isAuthenticated) {
      dispatch(setProductId(productId));
    }
  }, [productId, isAuthenticated]);

  const result = useMemo(
    () => ({
      product,
      specs,
      variants,
    }),
    [product, specs, variants]
  );

  return result;
};

export default useOcProductDetail;
