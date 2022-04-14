import Image from 'next/image';
import styles from './Footer.module.css';

const Footer = () => {

  return (
    <footer className={styles.footer}>
      <div className={styles.primary}>
        <div className="wrapper">
          <div className={styles['primary-top']}>
            <Image src="/images/apmt-footer-logo.svg" height={70} width={300} />
            <nav>
              <ul className={styles['primary-social']}>
                <li>
                  <Image src="/images/twitter.svg" height={20} width={22} />
                </li>
                <li>
                  <Image src="/images/instagram.svg" height={18} width={18} />
                </li>
              </ul>
            </nav>
          </div>
          <div className={styles['primary-bottom']}>
            <div className={styles['primary-account']}>
              <h4>Create an Account</h4>
              <p>An APM Terminals account enables you to save containers to your Container Watchlist, set daily Watchlist email notifications, and subscribe for Terminal Alerts. Terminal Alerts provide you with real-time, personalised operational updates via SMS or email. An APM Terminals account is also required for using the Truck Appointment System at some terminals.</p>
              <button>Register &gt;</button>
            </div>
            <nav className={styles['primary-corporate']}>
              <h4>Corporate links</h4>
              <ul>
                <li>About APM Terminals</li>
                <li>Global News</li>
                <li>Terminal Locations</li>
                <li>Contact Us</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <nav className={styles.secondary}>
        <div className={`wrapper ${styles['secondary-wrapper']}`}>
          <p>APM TERMINALS &copy; COPYRIGHT {new Date().getFullYear()}</p>
          <ul className={styles['secondary-links']}>
            <li>Legal Notices</li>
            <li>Privacy Policy</li>
            <li>Careers</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </nav>
    </footer>
  )
};

export default Footer;