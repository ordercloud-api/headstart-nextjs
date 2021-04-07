import Head from "next/head";
import Link from "next/link";
import {FunctionComponent} from "react";
import { useSelector } from "react-redux";
import logout from "../ordercloud/redux/ocAuth/logout";
import { OcRootState, useOcDispatch } from "../ordercloud/redux/ocStore";

const Layout:FunctionComponent = ({children}) => {

    const dispatch = useOcDispatch()

    const {user, isAnonymous, loading} = useSelector((state:OcRootState) => ({
      user: state.ocUser.user,
      error: state.ocAuth.error,
      loading: state.ocAuth.loading,
      isAnonymous: state.ocAuth.isAnonymous,
    }))

    return (
        <>
            <Head>
                <title>React Headstart</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <h1>React Headstart</h1>
                <nav>
                    <Link href="/"><a>Home</a></Link>
                    <Link href="/products"><a>Products</a></Link>
                    {isAnonymous ? (
                        <Link href="/login"><a>Login</a></Link>
                    ) : (
                        <button disabled={loading} onClick={() => dispatch(logout())}>Logout</button>
                    )}
                    {!isAnonymous && user && (
                        <p>{`${user.FirstName} ${user.LastName}`}</p>
                    )}
                </nav>
            </header>
            <main>
                {children}
            </main>
        </>
    )
}

export default Layout;