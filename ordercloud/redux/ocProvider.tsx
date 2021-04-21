import { isEqual } from 'lodash'
import { FunctionComponent, useEffect } from 'react'
import { Provider } from 'react-redux'
import logout from './ocAuth/logout'
import { setConfig, OcConfig } from './ocConfig'
import { retrieveOrder } from './ocCurrentOrder'
import ocStore from './ocStore'
import { getUser } from './ocUser'

interface OcProviderProps {
  config: OcConfig
}

const OcProvider: FunctionComponent<OcProviderProps> = ({ children, config }) => {
  useEffect(() => {
    const { ocConfig, ocAuth, ocUser, ocCurrentOrder } = ocStore.getState()
    if (!ocConfig.value || !isEqual(ocConfig.value, config)) {
      ocStore.dispatch(setConfig(config))
    }
    if (
      (ocAuth.isAnonymous && !ocAuth.isAuthenticated) ||
      (ocAuth.isAuthenticated && config.clientId.toLowerCase() !== ocAuth.decodedToken.cid)
    ) {
      ocStore.dispatch(logout())
    } else if (ocAuth.isAuthenticated) {
      if (!ocUser.user) {
        ocStore.dispatch(getUser())
      }
      if (!ocCurrentOrder.initialized) {
        ocStore.dispatch(retrieveOrder())
      }
    }
  }, [config])

  return <Provider store={ocStore}>{children}</Provider>
}

export default OcProvider
