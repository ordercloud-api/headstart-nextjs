import { BuyerProduct, RequiredDeep } from 'ordercloud-javascript-sdk'
import { useEffect } from 'react'
import { getProduct, ocProductCacheSelectors } from '../redux/ocProductCache'
import { useOcDispatch, useOcSelector } from '../redux/ocStore'

const useOcProduct = (productId: string): RequiredDeep<BuyerProduct> => {
  const dispatch = useOcDispatch()
  const { product, isAuthenticated } = useOcSelector((s) => ({
    isAuthenticated: s.ocAuth.isAuthenticated,
    product: ocProductCacheSelectors.selectById(s, productId),
  }))

  useEffect(() => {
    if (isAuthenticated && (!product || product.ID !== productId)) {
      dispatch(getProduct(productId))
    }
  }, [dispatch, isAuthenticated, product, productId])

  return product
}

export default useOcProduct
