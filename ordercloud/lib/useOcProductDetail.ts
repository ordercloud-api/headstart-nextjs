import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { setProductId } from '../redux/ocProductDetail'
import { useOcDispatch, OcRootState } from '../redux/ocStore'

const useOcProductDetail = (productId: string) => {
  const dispatch = useOcDispatch()

  const { product, specs, variants, isAuthenticated } = useSelector((state: OcRootState) => ({
    product: state.ocProductDetail.product,
    specs: state.ocProductDetail.specs,
    variants: state.ocProductDetail.variants,
    isAuthenticated: state.ocAuth.isAuthenticated,
  }))

  useEffect(() => {
    let promise
    if (productId && isAuthenticated) {
      promise = dispatch(setProductId(productId))
    }
    return () => promise && promise.abort()
  }, [productId, isAuthenticated])

  const result = useMemo(
    () => ({
      product,
      specs,
      variants,
    }),
    [product, specs, variants]
  )

  return result
}

export default useOcProductDetail
