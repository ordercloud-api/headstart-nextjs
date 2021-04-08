import { useRouter } from 'next/router'
import React, { FunctionComponent } from 'react'
import OcLoginForm from '../ordercloud/components/OcLoginForm'

const LoginPage: FunctionComponent = () => {
  const { push } = useRouter()

  const handleOnLoggedIn = () => {
    push('/products')
  }

  return (
    <div>
      <OcLoginForm onLoggedIn={handleOnLoggedIn} />
    </div>
  )
}

export default LoginPage
