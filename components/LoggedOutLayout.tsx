import Head from 'next/head';
import { FunctionComponent } from 'react'
import Header from './Header';
import Footer from './Footer';

const LoggedOutLayout: FunctionComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>React Headstart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="wrapper">{children}</div>
      </main>
    </>
  );
};

export default LoggedOutLayout;