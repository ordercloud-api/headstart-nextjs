import { isEqual } from 'lodash'
import { BuyerAddress, Filters, Searchable, Sortable } from 'ordercloud-javascript-sdk'
import { useEffect } from 'react'
import {
  deleteAddress,
  listAddresses,
  ocAddressBookSelectors,
  saveAddress,
} from '../redux/ocAddressBook'
import { useOcDispatch, useOcSelector } from '../redux/ocStore'

export interface OcAddressListOptions {
  search?: string
  searchOn?: Searchable<'Me.ListAddresses'>
  sortBy?: Sortable<'Me.ListAddresses'>
  page?: number
  pageSize?: number
  filters?: Filters
}

const useOcAddressBook = (
  listOptions: OcAddressListOptions
): {
  addresses: BuyerAddress[]
  saveAddress: (address: Partial<BuyerAddress>) => void
  deleteAddress: (addressId: string) => void
} => {
  const dispatch = useOcDispatch()
  const { addresses, options, isAuthenticated } = useOcSelector((s) => ({
    isAuthenticated: s.ocAuth.isAuthenticated,
    addresses: ocAddressBookSelectors.selectAll(s),
    options: s.ocAddressBook.options,
  }))

  useEffect(() => {
    if (isAuthenticated && (!options || (options && !isEqual(listOptions, options)))) {
      dispatch(listAddresses(listOptions))
    }
  }, [isAuthenticated, listOptions, options, dispatch])

  return {
    addresses,
    saveAddress: (address: Partial<BuyerAddress>) => {
      dispatch(saveAddress(address))
    },
    deleteAddress: (addressId: string) => {
      dispatch(deleteAddress(addressId))
    },
  }
}

export default useOcAddressBook
