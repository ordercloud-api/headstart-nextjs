import Link from 'next/link'
import { BuyerProduct, Filters } from 'ordercloud-javascript-sdk'
import { FunctionComponent, useCallback } from 'react'
import OcProductCard from '../../ordercloud/components/OcProductCard'
import OcProductFacetForm from '../../ordercloud/components/OcProductFacetsForm'
import OcProductList from '../../ordercloud/components/OcProductList'
import useNextRouterMapping, { NextQueryMap } from '../../ordercloud/hooks/useNextRouterMapping'

const queryMap: NextQueryMap = {
  search: 's',
  page: 'p',
  pageSize: 'ps',
  searchOn: 'so',
  sortBy: 'o',
  'xp.size': 'size',
  'xp.color': 'color',
  'xp.test_boolean': 'bool',
  'xp.test_number': 'num',
}

const ProductListPage: FunctionComponent = () => {
  const { isReady, options, updateQuery } = useNextRouterMapping(queryMap)

  const handleFacetChange = useCallback(
    (updatedFilters: Filters) => {
      updateQuery({ ...options, page: undefined, filters: updatedFilters })
    },
    [options, updateQuery]
  )

  const handleRenderItem = (p: BuyerProduct) => {
    return (
      <Link href={`/products/${p.ID}`}>
        <a>
          <OcProductCard product={p} />
        </a>
      </Link>
    )
  }

  return (
    isReady && (
      <>
        <h2>Facets</h2>
        <OcProductFacetForm onChange={handleFacetChange} />
        <h2>Products</h2>
        <OcProductList options={options} renderItem={handleRenderItem} />
      </>
    )
  )
}

export default ProductListPage
