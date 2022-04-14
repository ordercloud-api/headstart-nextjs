import Head from 'next/head';
import { FunctionComponent } from 'react'
import Header from '../components/Header';

const Layout: FunctionComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>React Headstart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <main>
        <div className="wrapper">{children}</div>
      </main>
    </>
  );
};

export default Layout;