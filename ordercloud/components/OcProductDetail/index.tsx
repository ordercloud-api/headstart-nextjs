import { Spec } from 'ordercloud-javascript-sdk'
import { FormEvent, FunctionComponent, useCallback, useEffect, useState } from 'react'
import useOcProductDetail from '../../hooks/useOcProductDetail'
import { createLineItem, updateLineItem } from '../../redux/ocCurrentOrder'
import { useOcDispatch, useOcSelector } from '../../redux/ocStore'
import formatPrice from '../../utils/formatPrice'
import OcQuantityInput from '../OcQuantityInput'
import OcProductSpecField from './OcProductSpecField'

interface OcProductDetailProps {
  productId: string
  lineItemId?: string
  onLineItemAdded?: () => void
  onLineItemUpdated?: () => void
}

const determineDefaultOptionId = (spec: Spec) => {
  if (spec.DefaultOptionID) return spec.DefaultOptionID
  return spec.OptionCount ? spec.Options[0].ID : undefined
}

const OcProductDetail: FunctionComponent<OcProductDetailProps> = ({
  productId,
  lineItemId,
  onLineItemAdded,
  onLineItemUpdated,
}) => {
  const dispatch = useOcDispatch()
  const { product, specs, variants } = useOcProductDetail(productId)
  const [loading, setLoading] = useState(false)

  const [specValues, setSpecValues] = useState([])

  const lineItem = useOcSelector((s) =>
    lineItemId && s.ocCurrentOrder.lineItems
      ? s.ocCurrentOrder.lineItems.find((li) => li.ID === lineItemId)
      : undefined
  )

  useEffect(() => {
    if (lineItem) {
      setSpecValues(lineItem.Specs)
    } else if (specs) {
      setSpecValues(
        specs.map((s) => {
          return {
            SpecID: s.ID,
            OptionID: determineDefaultOptionId(s),
            Value: s.DefaultValue ? s.DefaultValue : undefined,
          }
        })
      )
    }
  }, [specs, lineItem])

  const [quantity, setQuantity] = useState(
    lineItem ? lineItem.Quantity : (product && product.PriceSchedule.MinQuantity) || 1
  )

  const handleSpecFieldChange = (values: { SpecID: string; OptionID?: string; Value?: string }) => {
    setSpecValues((sv) =>
      sv.map((s) => {
        if (s.SpecID === values.SpecID) {
          return {
            SpecID: values.SpecID,
            OptionID: values.OptionID === 'OpenText' ? undefined : values.OptionID,
            Value: values.Value,
          }
        }
        return s
      })
    )
  }

  const handleAddToCart = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setLoading(true)
      await dispatch(
        createLineItem({ ProductID: product.ID, Quantity: quantity, Specs: specValues })
      )
      setLoading(false)
      if (onLineItemAdded) {
        onLineItemAdded()
      }
    },
    [dispatch, product, quantity, onLineItemAdded, specValues]
  )

  const handleUpdateCart = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setLoading(true)
      await dispatch(updateLineItem({ ...lineItem, Quantity: quantity, Specs: specValues }))
      setLoading(false)
      if (onLineItemUpdated) {
        onLineItemUpdated()
      }
    },
    [dispatch, lineItem, quantity, onLineItemUpdated, specValues]
  )

  return product ? (
    <div>
      <h2>{product.Name}</h2>
      <b>{formatPrice(product.PriceSchedule.PriceBreaks[0].Price)}</b>
      {/* eslint-disable-next-line */}
      <p dangerouslySetInnerHTML={{ __html: product.Description }} />
      <form onSubmit={lineItem ? handleUpdateCart : handleAddToCart}>
        {specs &&
          specs.map((s) => {
            const specValue = specValues.find((sv) => sv.SpecID === s.ID)
            return (
              <OcProductSpecField
                key={s.ID}
                spec={s}
                onChange={handleSpecFieldChange}
                optionId={specValue && specValue.OptionID}
                value={specValue && specValue.Value}
              />
            )
          })}
        <OcQuantityInput
          controlId="addToCart"
          priceSchedule={product.PriceSchedule}
          quantity={quantity}
          onChange={setQuantity}
        />
        <button type="submit" disabled={loading}>
          {`${lineItem ? 'Update' : 'Add To'} Cart`}
        </button>
      </form>
    </div>
  ) : null
}

export default OcProductDetail
