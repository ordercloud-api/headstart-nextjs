import { FunctionComponent } from 'react'
import { useOcSelector } from '../ordercloud/redux/ocStore'
import styles from '../styles/Home.module.css'
import type { ReactElement } from 'react'
import Layout from '../components/Layout'

export default function Page() {
  const user = useOcSelector((s) => s.ocUser.user)
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>React Headstart</h1>

        <p className={styles.description}>OrderCloud shopping experience built on React</p>

        {user && (
          <pre className={styles.code}>
            <code>{JSON.stringify(user, null, 2)}</code>
          </pre>
        )}
      </main>
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
};