import { ListFacet } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import OcProductFacetField from './OcProductFacetField'

interface OcProductFacetProps {
  facet: ListFacet
  values: string[] | undefined
  onChange: (xpPath: string, newValues?: string[]) => void
}

const OcProductFacet: FunctionComponent<OcProductFacetProps> = ({ facet, values, onChange }) => {
  const handleChange = (updated: string[]) => {
    onChange(facet.XpPath, updated)
  }
  return (
    <div>
      <p>{facet.Name}</p>
      {facet.Values.map((v) => {
        const valueId = `${facet.XpPath}_${v.Value}`
        return (
          <OcProductFacetField
            onChange={handleChange}
            key={valueId}
            valueId={valueId}
            value={v.Value}
            count={v.Count}
            selected={values}
          />
        )
      })}
    </div>
  )
}

export default OcProductFacet
