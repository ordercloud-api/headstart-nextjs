import Head from 'next/head'
import Link from 'next/link'
import { FunctionComponent } from 'react'
import logout from '../ordercloud/redux/ocAuth/logout'
import { useOcDispatch, useOcSelector } from '../ordercloud/redux/ocStore'

const Layout: FunctionComponent = ({ children }) => {
  const dispatch = useOcDispatch()

  const { user, isAnonymous, loading, lineItemCount } = useOcSelector((s) => ({
    user: s.ocUser.user,
    loading: s.ocAuth.loading,
    isAnonymous: s.ocAuth.isAnonymous,
    lineItemCount: s.ocCurrentOrder.order ? s.ocCurrentOrder.order.LineItemCount : 0,
  }))

  return (
    <>
      <Head>
        <title>React Headstart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>React Headstart</h1>
        <p>{`Cart Count ${lineItemCount}`}</p>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/cart">
            <a>Cart</a>
          </Link>
          <Link href="/products">
            <a>Products</a>
          </Link>
          {isAnonymous ? (
            <Link href="/login">
              <a>Login</a>
            </Link>
          ) : (
            <button type="button" disabled={loading} onClick={() => dispatch(logout())}>
              Logout
            </button>
          )}
          {!isAnonymous && user && <p>{`${user.FirstName} ${user.LastName}`}</p>}
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default Layout
