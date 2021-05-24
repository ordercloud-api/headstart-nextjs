import { FunctionComponent, useState } from 'react'
import OcCheckoutBilling from './OcCheckoutBilling'
import OcCheckoutShipping from './OcCheckoutShipping'
import OcCheckoutSummary from './OcCheckoutSummary'

const OcCheckout: FunctionComponent = () => {
  const [step, setStep] = useState(0)

  const handlePrevClick = () => {
    setStep((s) => s - 1)
  }

  const handleNextClick = () => {
    setStep((s) => s + 1)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `1fr minmax(150px, 25%)` }}>
      <div>
        {step === 0 && <OcCheckoutShipping />}
        {step === 1 && <OcCheckoutBilling />}
        <button type="button" onClick={handlePrevClick} disabled={step === 0}>
          Prev
        </button>
        <button type="button" onClick={handleNextClick} disabled={step >= 2}>
          Next
        </button>
      </div>
      <div>
        <OcCheckoutSummary />
      </div>
    </div>
  )
}

export default OcCheckout
