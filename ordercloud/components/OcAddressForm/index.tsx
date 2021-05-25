import { isEqual } from 'lodash'
import { BuyerAddress } from 'ordercloud-javascript-sdk'
import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { EMPTY_ADDRESS } from '../../redux/ocAddressBook'

interface OcAddressFormProps {
  id: string
  onSubmit: (address: BuyerAddress) => void
  onDelete?: (addressId: string) => void
  address?: BuyerAddress
}

const OcAddressForm: FunctionComponent<OcAddressFormProps> = ({
  id,
  onSubmit,
  onDelete,
  address,
}) => {
  const [formValues, setFormValues] = useState(address || EMPTY_ADDRESS)

  useEffect(() => {
    setFormValues(address || EMPTY_ADDRESS)
  }, [address])

  const handleFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      onSubmit(formValues)
    },
    [onSubmit, formValues]
  )

  const handleDeleteAddress = useCallback(() => {
    onDelete(address.ID)
  }, [onDelete, address])

  const handleInputChange = (field: keyof BuyerAddress) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((s) => ({ ...s, [field]: e.target.value }))
  }

  const handleDiscardChanges = useCallback(() => {
    setFormValues(address || EMPTY_ADDRESS)
  }, [address])

  const hasChanges = useMemo(() => {
    return !isEqual(address, formValues)
  }, [address, formValues])

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor={`${id}_address_addressName`}>
        Address Name
        <input
          type="text"
          id={`${id}_address_addressName`}
          name="address_addressName"
          placeholder="Enter a name for your address"
          value={formValues.AddressName}
          onChange={handleInputChange('AddressName')}
        />
      </label>
      <label htmlFor={`${id}_address_companyName`}>
        Company Name
        <input
          type="text"
          id={`${id}_address_companyName`}
          name="address_companyName"
          placeholder="Enter company name"
          value={formValues.CompanyName}
          onChange={handleInputChange('CompanyName')}
        />
      </label>
      <label htmlFor={`${id}_address_firstName`}>
        First Name
        <input
          type="text"
          id={`${id}_address_firstName`}
          name="address_firstName"
          placeholder="Enter first name"
          value={formValues.FirstName}
          onChange={handleInputChange('FirstName')}
          required
        />
      </label>
      <label htmlFor={`${id}_address_lastName`}>
        Last Name
        <input
          type="text"
          id={`${id}_address_lastName`}
          name="address_lastName"
          placeholder="Enter last name"
          value={formValues.LastName}
          onChange={handleInputChange('LastName')}
          required
        />
      </label>
      <label htmlFor={`${id}_address_street1`}>
        Street Address
        <input
          type="text"
          id={`${id}_address_street1`}
          name="address_street1"
          placeholder="Enter street address"
          value={formValues.Street1}
          onChange={handleInputChange('Street1')}
          required
        />
      </label>
      <label htmlFor={`${id}_address_street2`}>
        Address Line 2
        <input
          type="text"
          id={`${id}_address_street2`}
          name="address_street2"
          placeholder="Floor, suite, apartment #"
          value={formValues.Street2}
          onChange={handleInputChange('Street2')}
        />
      </label>
      <label htmlFor={`${id}_address_city`}>
        City
        <input
          type="text"
          id={`${id}_address_city`}
          name="address_city"
          placeholder="Enter city"
          value={formValues.City}
          onChange={handleInputChange('City')}
          required
        />
      </label>
      <label htmlFor={`${id}_address_state`}>
        State
        <input
          type="text"
          id={`${id}_address_state`}
          name="address_state"
          placeholder="Enter state"
          value={formValues.State}
          onChange={handleInputChange('State')}
          required
        />
      </label>
      <label htmlFor={`${id}_address_zip`}>
        Zip
        <input
          type="text"
          id={`${id}_address_zip`}
          name="address_zip"
          placeholder="Enter zip code"
          value={formValues.Zip}
          onChange={handleInputChange('Zip')}
          required
        />
      </label>
      <label htmlFor={`${id}_address_country`}>
        Country
        <input
          type="text"
          id={`${id}_address_country`}
          name="address_country"
          placeholder="Enter two-digit country code"
          value={formValues.Country}
          onChange={handleInputChange('Country')}
          required
        />
      </label>
      <label htmlFor={`${id}_address_phone`}>
        Phone Number
        <input
          type="text"
          id={`${id}_address_phone`}
          name="address_phone"
          placeholder="Enter 10 digit phone number"
          value={formValues.Phone}
          onChange={handleInputChange('Phone')}
        />
      </label>
      <button type="button" onClick={handleDeleteAddress} disabled={hasChanges || !address.ID}>
        Delete Address
      </button>
      <button type="button" onClick={handleDiscardChanges} disabled={!hasChanges}>
        Discard Changes
      </button>
      <button type="submit" disabled={!hasChanges}>
        {address && address.ID ? 'Update Address' : 'Save Address'}
      </button>
    </form>
  )
}

export default OcAddressForm
