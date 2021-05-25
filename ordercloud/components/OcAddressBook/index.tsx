import { BuyerAddress } from 'ordercloud-javascript-sdk'
import { ChangeEvent, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import useOcAddressBook, { OcAddressListOptions } from '../../hooks/useOcAddressBook'
import OcAddressForm from '../OcAddressForm'

interface OcAddressBookProps {
  id: string
  selected?: string // id of the selected address
  onChange?: (address: BuyerAddress) => void
  listOptions?: OcAddressListOptions
}

const OcAddressBook: FunctionComponent<OcAddressBookProps> = ({
  id,
  listOptions,
  selected,
  onChange,
}) => {
  const { addresses, saveAddress, deleteAddress } = useOcAddressBook(listOptions)
  const [selectedId, setSelectedId] = useState(selected || '')

  useEffect(() => {
    setSelectedId(selected || '')
  }, [selected])

  // useEffect(() => {
  //   setSelectedId((sid) => (sid || addresses.length ? addresses[addresses.length - 1].ID : ''))
  // }, [addresses])

  const handleSelectionChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(addresses.find((a) => a.ID === e.target.value))
      } else {
        setSelectedId(e.target.value)
      }
    },
    [onChange, addresses]
  )

  const handleDeleteAddress = useCallback(
    async (addressId: string) => {
      await deleteAddress(addressId)
      if (onChange) {
        onChange(undefined)
      } else {
        setSelectedId('')
      }
    },
    [deleteAddress, onChange]
  )

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => a.ID === selectedId)
  }, [addresses, selectedId])

  return addresses.length ? (
    <div>
      <label htmlFor="select_address">
        Select an address
        <select
          id="select_address"
          name="select_address"
          value={selectedId || ''}
          onChange={handleSelectionChange}
        >
          <option value="">None Selected</option>
          {addresses.map((a) => (
            <option key={a.ID} value={a.ID}>
              {a.Street1}
            </option>
          ))}
        </select>
      </label>
      <OcAddressForm
        id={`${id}_address_book`}
        address={selectedAddress}
        onSubmit={saveAddress}
        onDelete={handleDeleteAddress}
      />
    </div>
  ) : (
    <OcAddressForm id={`${id}_address_book`} onSubmit={saveAddress} />
  )
}

export default OcAddressBook
