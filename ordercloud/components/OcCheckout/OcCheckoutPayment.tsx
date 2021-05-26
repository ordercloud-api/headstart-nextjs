import { Payment } from 'ordercloud-javascript-sdk'
import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { OcCheckoutStepProps } from '.'
import useOcCurrentOrder from '../../hooks/useOcCurrentOrder'
import { addPayment } from '../../redux/ocCurrentOrder'
import { useOcDispatch } from '../../redux/ocStore'
import formatPrice from '../../utils/formatPrice'

const OcCheckoutPayment: FunctionComponent<OcCheckoutStepProps> = ({ onNext, onPrev }) => {
  const dispatch = useOcDispatch()
  const { order, payments } = useOcCurrentOrder()

  const amountDue = useMemo(() => {
    if (!order) return 0
    if (!payments.length) return order.Total
    return order.Total - payments.map((p) => p.Amount).reduceRight((p, c) => p + c)
  }, [order, payments])

  const [pendingPayment, setPendingPayment] = useState(amountDue)

  const handleAddPayment = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      dispatch(addPayment({ Type: 'PurchaseOrder', Amount: pendingPayment }))
    },
    [dispatch, pendingPayment]
  )

  useEffect(() => {
    setPendingPayment(amountDue)
  }, [amountDue])

  const handlePendingPaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPendingPayment(Number(e.target.value))
  }

  return (
    <div>
      <h2>Payment</h2>
      <h3>{`Amount Due ${formatPrice(amountDue)}`}</h3>
      {payments.map((p) => (
        <p key={p.ID}>
          {p.Type}
          <b>{` ${formatPrice(p.Amount)}`}</b>
        </p>
      ))}
      <form id="checkout_payment" onSubmit={handleAddPayment}>
        <label htmlFor="checkout_pending_payment">
          Payment Amount
          <input
            id="checkout_pending_payment"
            type="number"
            max={amountDue}
            min="1"
            value={pendingPayment}
            step="0.01"
            onChange={handlePendingPaymentChange}
          />
        </label>
        <button type="submit" disabled={!amountDue}>
          Add Payment
        </button>
      </form>
      <hr />
      <button type="button" onClick={onPrev}>
        Edit Billing
      </button>
      <button type="button" onClick={onNext} disabled={!!amountDue}>
        Review Order
      </button>
    </div>
  )
}

export default OcCheckoutPayment
