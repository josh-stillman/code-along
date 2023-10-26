import Link from 'next/link';
import styles from './NavBar.module.css';

export const NavBar = () => {
  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.link}>
          <span className={styles.siteHeader}>jss.computer</span>
        </Link>

        <Link href="/foobar" className={styles.link}>
          <span className={styles.navLinkText}>Go to foobar page!</span>
        </Link>
      </nav>
    </>
  );
};
