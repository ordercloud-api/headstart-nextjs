import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import React from 'react'
import logout from '../ordercloud/redux/ocAuth/logout'
import { useOcDispatch, OcRootState } from '../ordercloud/redux/ocStore'
import styles from '../styles/Home.module.css'

export default function Home() {
  const dispatch = useOcDispatch()
  const user = useSelector((state: OcRootState) => state.ocUser.user)

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
