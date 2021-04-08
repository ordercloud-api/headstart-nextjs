import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { useEffect } from 'react'
import { OcProductListOptions, setListOptions } from '../redux/ocProductList'
import { useOcDispatch, useOcSelector } from '../redux/ocStore'

const useOcProductList = (options: OcProductListOptions): BuyerProduct[] => {
  const dispatch = useOcDispatch()

  const { products, isAuthenticated } = useOcSelector((s) => ({
    isAuthenticated: s.ocAuth.isAuthenticated,
    products: s.ocProductList.items,
  }))

  useEffect(() => {
    let promise
    if (isAuthenticated) {
      promise = dispatch(setListOptions(options))
    }
    return () => promise && promise.abort()
  }, [dispatch, options, isAuthenticated])

  return products
}

export default useOcProductList
