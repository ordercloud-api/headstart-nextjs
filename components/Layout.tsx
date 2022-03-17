import Head from 'next/head'
import Link from 'next/link'
import { FunctionComponent } from 'react'
import { useRouter } from 'next/router'
import logout from '../ordercloud/redux/ocAuth/logout'
import { useOcDispatch, useOcSelector } from '../ordercloud/redux/ocStore'
import styles from './Layout.module.css'

const Layout: FunctionComponent = ({ children }) => {
  const dispatch = useOcDispatch()
  const router = useRouter()

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
      <header className={styles.header}>
        <div className={`${styles.inner} wrapper`}>
          <nav className={styles.nav}>
            <Link href="/">
              <a className={`${styles.link} ${router.pathname === '/' ? `${styles.active}` : ''}`}>
                Home
              </a>
            </Link>
            <Link href="/cart">
              <a
                className={`${styles.link} ${
                  router.pathname === '/cart' ? `${styles.active}` : ''
                }`}
              >
                Cart
              </a>
            </Link>
            <Link href="/products">
              <a
                className={`${styles.link} ${
                  router.pathname === '/products' ? `${styles.active}` : ''
                }`}
              >
                Products
              </a>
            </Link>
            {isAnonymous ? (
              <Link href="/login">
                <a
                  className={`${styles.link} ${
                    router.pathname === '/login' ? `${styles.active}` : ''
                  }`}
                >
                  Login
                </a>
              </Link>
            ) : (
              <button
                className={styles.link}
                type="button"
                disabled={loading}
                onClick={() => dispatch(logout())}
              >
                Logout
              </button>
            )}
            {!isAnonymous && user && <p>{`${user.FirstName} ${user.LastName}`}</p>}
            <p className={styles.cart}>{`Cart Count ${lineItemCount}`}</p>
          </nav>
        </div>
      </header>
      {/* <h1>React Headstart</h1> */}
      <main>
        <div className="wrapper">{children}</div>
      </main>
    </>
  )
}

export default Layout
