/* eslint-disable react-hooks/exhaustive-deps */
// import { useAuth } from 'components/AuthProvider'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useOcSelector } from '../../ordercloud/redux/ocStore'

export default function AuthGuard({ children }: { children: JSX.Element }) {
  // const { user, initializing, setRedirect } = useAuth()

  const { user, isAnonymous, loading } = useOcSelector((s) => ({
    user: s.ocUser.user,
    loading: s.ocAuth.loading,
    isAnonymous: s.ocAuth.isAnonymous,
  }))
  const router = useRouter()
  const [redirect, setRedirect] = useState(router.route)
  const didMountRef = useRef(false)

  //   useEffect(() => {
  //     if (didMountRef.current) {
  //       console.log(isAnonymous)
  //       console.log(user)
  //       console.log(loading)
  //       if (!loading) {
  //         // auth is initialized and there is no user
  //         if (isAnonymous) {
  //           // remember the page that user tried to access
  //           // setRedirect(router.route)
  //           // redirect
  //           setRedirect('/login')
  //           console.log('redirect login')
  //         } else {
  //           console.log('continue')
  //           // setRedirect(router.route)
  //         }
  //       }
  //     }

  //     didMountRef.current = true
  //     // setRedirect('/login')
  //   }, [user, loading, isAnonymous, router])

  //   useEffect(() => {
  //     console.log(redirect)

  //     router.push(redirect)
  //   }, [redirect])

  useEffect(() => {
    if (didMountRef.current) {
      if (isAnonymous) {
        router.push('/login')
      }
    }

    didMountRef.current = true
  }, [user])

  //   return <>{children}</>
  //   /* show loading indicator while the auth provider is still initializing */
  //   if (loading || !redirect) {
  //     return <h1>Application Loading</h1>
  //   }

  //   // if auth initialized with a valid user show protected page
  if ((!isAnonymous && user) || router.route === '/login') {
    return <>{children}</>
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null
}
