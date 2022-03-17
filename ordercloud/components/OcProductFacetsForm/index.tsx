import { isNil, mapKeys, mapValues, omitBy } from 'lodash'
import { Filters, ListFacet } from 'ordercloud-javascript-sdk'
import { FormEvent, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { useOcSelector } from '../../redux/ocStore'
import OcProductFacet from './OcProductFacet'

export interface OcProductFacetsFormProps {
  onChange: (filters: { [x: string]: string }) => void
}

function mapOptionFilters(filters?: Filters): { [x: string]: string[] | undefined } {
  if (!filters) return {}
  return mapValues(
    mapKeys(omitBy(filters, isNil), (v, k: string) => k.toLowerCase()),
    (v) => {
      return typeof v === 'string' ? v.split('|') : [String(v)]
    }
  )
}

const OcProductFacetsForm: FunctionComponent<OcProductFacetsFormProps> = ({ onChange }) => {
  const { options, meta, loading } = useOcSelector((s) => s.ocProductList)
  console.log(meta)

  const [filters, setFilters] = useState(mapOptionFilters(options && options.filters))

  const showClearButton = useMemo(() => {
    return Boolean(Object.values(filters).join('').length)
  }, [filters])

  const shouldClearCallOnChange = useMemo(() => {
    return Boolean(Object.values(mapOptionFilters(options && options.filters)).join('').length)
  }, [options])

  const handleClearFilters = useCallback(() => {
    setFilters({})
    if (shouldClearCallOnChange) {
      onChange({})
    }
  }, [onChange, shouldClearCallOnChange])

  useEffect(() => {
    setFilters(mapOptionFilters(options && options.filters))
  }, [options])

  const handleFacetChange = useCallback((xpPath: string, newValue: string[]) => {
    console.log(xpPath)
    setFilters((f) => {
      return f ? { ...f, [`xp.${xpPath}`]: newValue } : { [`xp.${xpPath}`]: newValue }
    })
  }, [])

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      console.log(filters)
      console.log(mapValues(filters, (v) => v && v.join('|')))
      onChange(mapValues(filters, (v) => v && v.join('|')))
    },
    [onChange, filters]
  )

  const mapProductFacets = useCallback(
    (f: ListFacet) => {
      console.log(f)
      return (
        <OcProductFacet
          key={f.XpPath}
          facet={f}
          values={filters[`xp.${f.XpPath}`] || []}
          onChange={handleFacetChange}
        />
      )
    },
    [handleFacetChange, filters]
  )

  return (
    <form onSubmit={handleSubmit}>
      {meta && meta.Facets && meta.Facets.map(mapProductFacets)}
      <button type="submit" disabled={loading}>
        Apply Filters
      </button>
      {showClearButton && (
        <button type="button" disabled={loading} onClick={handleClearFilters}>
          Clear Filters
        </button>
      )}
    </form>
  )
}

export default OcProductFacetsForm
