import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ApiRole } from 'ordercloud-javascript-sdk';
import type { ReactElement, ReactNode } from 'react';
import AuthGuard from '../components/AuthGuard';
import Layout from '../components/Layout';
import OcProvider from '../ordercloud/redux/ocProvider';
import '../styles/globals.css';

const clientId = process.env.NEXT_PUBLIC_OC_CLIENT_ID || ''
const scope = process.env.NEXT_PUBLIC_OC_SCOPE
  ? (process.env.NEXT_PUBLIC_OC_SCOPE.split(',') as ApiRole[])
  : []
const baseApiUrl = process.env.NEXT_PUBLIC_OC_BASE_API_URL
const allowAnonymous = Boolean(process.env.NEXT_PUBLIC_OC_ALLOW_ANONYMOUS)

// function MyApp({ Component, pageProps }: AppProps): JSX.Element {
//   const getToken = async () => {
//     // const roles: ApiRole = [
//     //   'Shopper',
//     //   'MeAddressAdmin',
//     //   'PasswordReset',
//     //   'MeAdmin',
//     //   'OrderAdmin',
//     //   'OrderReader',
//     // ]
//     // await Auth.Anonymous('1C78FDC8-F202-4D98-886A-6B6E0C48D204', roles).then((response) => {
//     //   console.log(response)
//     //   const token = response.access_token
//     //   Tokens.SetAccessToken(token)
//     // })
//   }

//   useEffect(() => {
//     // getToken()
//   }, [])

//   return (
//     <OcProvider
//       config={{
//         clientId,
//         scope,
//         baseApiUrl,
//         allowAnonymous,
//         cookieOptions: {
//           prefix: 'hds-nextjs',
//           path: '/',
//         },
//       }}
//     >
//       <AuthGuard>
//         <Layout>
//           <Component {...pageProps} />
//         </Layout>
//       </AuthGuard>
//     </OcProvider>
//   )
// }

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => {
    return (
      <Layout>
        {page}
      </Layout>
    );
  });

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
      <AuthGuard>
        {getLayout(
          <Component {...pageProps} />
        )}
      </AuthGuard>
    </OcProvider>
  )
}