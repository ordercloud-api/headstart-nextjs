import Head from 'next/head'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import login from '../redux/ocAuth/login'
import logout from '../redux/ocAuth/logout'
import { OcDispatch, OcRootState } from '../redux/ocStore'
import styles from '../styles/Home.module.css'

export default function Home() {
  const dispatch = useDispatch<OcDispatch>()
  const {user, isAnonymous, error, loading} = useSelector((state:OcRootState) => ({
    user: state.ocUser.user,
    error: state.ocAuth.error,
    loading: state.ocAuth.loading,
    isAnonymous: state.ocAuth.isAnonymous,
  }))

  return (
    <div className={styles.container}>
      <Head>
        <title>React Headstart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          React Headstart
        </h1>

        <p className={styles.description}>
          OrderCloud shopping experience built on React
        </p>

        {isAnonymous ? (
            <Link href="/login">Login</Link>
          ) : (
            <button disabled={loading} onClick={() => dispatch(logout())}>Logout</button>
        )}

        {error && (
            <code color="red">{error.message}</code>
        )}

        {user && (
          <pre>
            <code>{JSON.stringify(user, null, 2)}</code>
          </pre>
        )}
      </main>
    </div>
  )
}
