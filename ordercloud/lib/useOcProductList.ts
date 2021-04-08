import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { OcProductListOptions, setListOptions } from '../redux/ocProductList'
import { useOcDispatch, OcRootState } from '../redux/ocStore'

const useOcProductList = (options: OcProductListOptions) => {
  const dispatch = useOcDispatch()

  const { products, isAuthenticated } = useSelector((state: OcRootState) => ({
    isAuthenticated: state.ocAuth.isAuthenticated,
    products: state.ocProductList.items,
  }))

  useEffect(() => {
    let promise
    if (isAuthenticated) {
      promise = dispatch(setListOptions(options))
    }
    return () => promise && promise.abort()
  }, [options, isAuthenticated])

  return products
}

export default useOcProductList
