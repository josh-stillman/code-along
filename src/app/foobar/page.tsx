/* eslint-disable @next/next/no-img-element */
import styles from './page.module.css';

export default function Foobar() {
  return (
    <>
      <h1 className={styles.hero}>Welcome to the Foobar page!</h1>

      <img
        className={styles.gif}
        src="/under-construction.gif"
        alt="under construction"
      />
    </>
  );
}
