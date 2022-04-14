import { useRouter } from 'next/router'
import { FunctionComponent } from 'react';
import type { ReactElement } from 'react'
import OcLoginForm from '../ordercloud/components/OcLoginForm'
import LoggedOutLayout from '../components/LoggedOutLayout';

const LoginPage: FunctionComponent = () => {
  const { push } = useRouter()

  const handleOnLoggedIn = () => {
    push('/singleService')
  }

  return (
    <main>
      <OcLoginForm onLoggedIn={handleOnLoggedIn} />
    </main>
  )
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LoggedOutLayout>
      {page}
    </LoggedOutLayout>
  )
};

export default LoginPage;