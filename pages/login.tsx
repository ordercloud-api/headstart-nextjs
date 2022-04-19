import { useRouter } from 'next/router'
import OcLoginForm from '../ordercloud/components/OcLoginForm'
import LoggedOutLayout from '../components/LoggedOutLayout'

const LoginPage = () => {
  const { push } = useRouter()

  const handleOnLoggedIn = () => {
    push('/singleService')
  }

  return (
    <div>
      <OcLoginForm onLoggedIn={handleOnLoggedIn} />
    </div>
  )
}

LoginPage.getLayout = function getLayout(page) {
  return <LoggedOutLayout>{page}</LoggedOutLayout>
}

export default LoginPage
