import { NewsFeed } from '../components/NewsFeed';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Hello World we are deployed!</h1>

        <Link href="/foobar">go to foobar page!</Link>
      </div>

      <NewsFeed />
    </main>
  );
}
