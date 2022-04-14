import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logout from '../../ordercloud/redux/ocAuth/logout';
import { useOcDispatch, useOcSelector } from '../../ordercloud/redux/ocStore';
import { MainNavLinks } from './links';
import styles from './Header.module.css';

const Header = () => {
  const dispatch = useOcDispatch();
  const router = useRouter();

  const { user, isAnonymous, loading, lineItemCount } = useOcSelector((s) => ({
    user: s.ocUser.user,
    loading: s.ocAuth.loading,
    isAnonymous: s.ocAuth.isAnonymous,
    lineItemCount: s.ocCurrentOrder.order ? s.ocCurrentOrder.order.LineItemCount : 0,
  }))

  return (
    <header className={styles.header}>

      <div className={styles["header-top"]}>
        <div className={`${styles["header-top__inner"]} wrapper`}>
          <div className={styles.logo}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 498 79.6" width="498" height="79.6"><path d="M89 42.8v-8.3l62.4-28.6v11zM23.1 53.2V59l96.8-48.6V0zM0 79.6l53.4-22.1v-6.7L0 75.2z" fill="#ff6441"></path><path d="M409.1 49.1l-12.9 29.5h7.5l2.8-6.4h14.9l2.8 6.4h7.9l-12.8-29.5zm-.1 17.4l5-11.4 5 11.4zm-95.8 12.1h5.7l7.9-16.6v16.6h7.1V49.1h-8.4l-9.4 21.4-9.4-21.4H298v29.5h7.1V62zm-167 0h5.7l7.9-16.6v16.6h7.1V49.1h-8.4l-9.4 21.4-9.4-21.4H131v29.5h7.1V62zm107.7-29.5v6.1h-20.5v6h17.1v5.9h-17.1v5.5h20.4v6.1h-28V49.2h28.1zm-185.8 0L55.2 78.6h7.5l2.8-6.4h14.9l2.8 6.4h7.9L78.3 49.1zM68 66.5l5-11.4 5 11.4zm49.8-4h-14.4v-7.6h14.4zM95.5 49.1v29.5h7.7v-10h17.3c2.2 0 4-1.3 4.2-4.2v-11c0-2.4-2.1-4.3-4.6-4.3H95.5zm349.3 0h-7.7v29.5h26.5v-6.1h-18.8zm-86 0v29.5h7.6V58.3l16.3 20.3h8.4V49.1h-7.7v20.3l-15.9-20.3zm-16.2 29.5h7.4V49.2h-7.4zM187.9 49.1v6.3h11.9v23.2h7.9V55.4h11.9v-6.3zm285.4 0c-2.2-.1-4.3 1.9-4.3 4v9.6c0 2.5 2.1 4.3 4.2 4.3h17.1v5.7h-13.6v-2.4h-8v4.1c0 2.2 2 4.3 4.3 4.3h20.8c2.1 0 4.2-1.6 4.2-4.4v-9.2c-.1-2.7-2.1-4.3-4.3-4.4h-16.8v-5.5h13.2v1.9h7.5v-3.9c.1-1.9-1.8-4.1-4.3-4h-20zm-212.4 0v29.5h7.5V67.8h8.6l5.8 10.8h8l-6-10.8h.7c2.3-.2 4-1.9 4-4.4v-10c0-2.4-2.1-4.3-4.6-4.3zm21.9 12.8h-14.5v-6.7h14.5z" fill="#3c3c46"></path></svg>
          </div>
          <div className={styles["global-group"]}>
            <nav className={styles["global-nav"]}>
              <li>
                <a href="#">
                  <button className={styles.terminal}>
                    <span>Switch Terminal</span>
                  </button>
                </a>
              </li>
              <li>
                <a href="#">
                  <button className={styles.Menu}>
                    <span className={styles.toggle}>
                      <span className={styles["toggle-dot"]}></span>
                      <span className={styles["toggle-dot"]}></span>
                      <span className={styles["toggle-dot"]}></span>
                      <span className={styles["toggle-dot"]}></span>
                      <span className={styles["toggle-dot"]}></span>
                      <span className={styles["toggle-dot"]}></span>
                      <span className={styles["toggle-dot"]}></span>
                      <span className={styles["toggle-dot"]}></span>
                      <span className={styles["toggle-dot"]}></span>
                    </span>
                    <span>Global Menu</span>
                  </button>
                </a>
              </li>
            </nav>
            <div className={styles.separator}></div>
            <div className={styles.login}>
            {isAnonymous ? (
              <Link href="/login">
                <a href="#" className={styles.loginlink}>
                  <div className={styles["login-header"]}>
                    <span className={styles["login-icon"]}>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20" width="20" height="20"><path d="M10.125 8.625a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75zm2.5 2.813c1.726 0 3.125 1.482 3.125 3.31V17h-1.875v-2.253c0-.816-.585-1.435-1.25-1.435h-5c-.665 0-1.25.619-1.25 1.435V17H4.5v-2.253c0-1.828 1.4-3.31 3.125-3.31zM10.125 3a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5z"></path></svg>
                    </span>
                    <span className={styles.logintext}>Your Account</span>
                  </div>
                </a>
              </Link>
              ) : (
                <button
                  className={styles.loginlink}
                  type="button"
                  disabled={loading}
                  onClick={() => dispatch(logout())}
                >
                  <div className={styles["login-header"]}>
                    <span className={styles["login-icon"]}>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20" width="20" height="20"><path d="M10.125 8.625a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75zm2.5 2.813c1.726 0 3.125 1.482 3.125 3.31V17h-1.875v-2.253c0-.816-.585-1.435-1.25-1.435h-5c-.665 0-1.25.619-1.25 1.435V17H4.5v-2.253c0-1.828 1.4-3.31 3.125-3.31zM10.125 3a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5z"></path></svg>
                    </span>
                    <span className={styles.logintext}>Logout, {!isAnonymous && user && user.LastName}</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles["header-bottom"]}>
        <div className={`${styles["header-bottom__inner"]} wrapper`}>
          <div className={styles["nav-heading"]}>
            <a href="#">Terminal Name</a>
          </div>
          <div className={styles.navigation}>
            <nav className={styles.nav}>
              {(MainNavLinks || []).map((link, i) => {
                return (
                  <li key={"nav" + i} className={link.IsDashboard ? styles.highlighted : ''}>
                    <Link href={link.Url}>
                      <a className={router.pathname === link.Url ? styles.active : ''}>
                        {link.IsDashboard && (
                          <Image src="/images/navigation.svg" height={16} width={22} />
                        )}
                        <span className={styles["link-label"]}>{link.Name}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
              <p className={styles.cart}>Cart Count {lineItemCount}</p>
            </nav>
          </div>

        </div>
      </div>
    </header>
  )
};

export default Header;