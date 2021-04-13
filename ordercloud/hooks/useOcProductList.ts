import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { useEffect } from 'react'
import { isEqual } from 'lodash'
import { OcProductListOptions, setListOptions } from '../redux/ocProductList'
import { useOcDispatch, useOcSelector } from '../redux/ocStore'

const useOcProductList = (listOptions: OcProductListOptions): BuyerProduct[] => {
  const dispatch = useOcDispatch()

  const { products, options, isAuthenticated } = useOcSelector((s) => ({
    isAuthenticated: s.ocAuth.isAuthenticated,
    products: s.ocProductList.items,
    options: s.ocProductList.options,
  }))

  useEffect(() => {
    let promise
    if (isAuthenticated && (!options || (options && !isEqual(listOptions, options)))) {
      promise = dispatch(setListOptions(listOptions))
    }
    return () => promise && promise.abort()
  }, [dispatch, options, listOptions, isAuthenticated])

  return products
}

export default useOcProductList
