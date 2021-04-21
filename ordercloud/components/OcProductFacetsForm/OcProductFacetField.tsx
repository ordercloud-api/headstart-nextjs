import { xor } from 'lodash'
import { FunctionComponent, useCallback } from 'react'

interface OcProductFacetFieldProps {
  count: number
  selected: string[]
  valueId: string
  value: string
  onChange: (updated: string[]) => void
}

const OcProductFacetField: FunctionComponent<OcProductFacetFieldProps> = ({
  valueId,
  count,
  selected,
  value,
  onChange,
}) => {
  const handleCheckboxChange = useCallback(() => {
    onChange(xor(selected, [value]))
  }, [selected, onChange, value])

  return (
    <label htmlFor={valueId}>
      <input
        id={valueId}
        type="checkbox"
        checked={selected.includes(value)}
        onChange={handleCheckboxChange}
      />{' '}
      {`${value} (${count})`}
    </label>
  )
}

export default OcProductFacetField
