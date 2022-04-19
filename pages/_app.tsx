import { ApiRole } from 'ordercloud-javascript-sdk'
import AuthGuard from '../components/AuthGuard'
import Layout from '../components/Layout'
import OcProvider from '../ordercloud/redux/ocProvider'
import '../styles/globals.css'

const clientId = process.env.NEXT_PUBLIC_OC_CLIENT_ID || ''
const scope = process.env.NEXT_PUBLIC_OC_SCOPE
  ? (process.env.NEXT_PUBLIC_OC_SCOPE.split(',') as ApiRole[])
  : []
const baseApiUrl = process.env.NEXT_PUBLIC_OC_BASE_API_URL
const allowAnonymous = Boolean(process.env.NEXT_PUBLIC_OC_ALLOW_ANONYMOUS)

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ??
    ((page) => {
      return <Layout>{page}</Layout>
    })

  return (
    <OcProvider
      config={{
        clientId,
        scope,
        baseApiUrl,
        allowAnonymous,
        cookieOptions: {
          prefix: 'hds-nextjs',
          path: '/',
        },
      }}
    >
      <AuthGuard>{getLayout(<Component {...pageProps} />)}</AuthGuard>
    </OcProvider>
  )
}
