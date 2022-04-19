import Head from 'next/head';
import { FunctionComponent } from 'react';
import styles from './index.module.css';

const LoggedOutLayout: FunctionComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>React Headstart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles['logged-out']}>
        <div className={styles['logged-out-wrapper']}>
          {children}
        </div>
      </main>
    </>
  );
};

export default LoggedOutLayout;