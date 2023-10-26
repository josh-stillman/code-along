import { NewsFeed } from '../components/NewsFeed/NewsFeed';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <div className={styles.description}>
        <h1 className={styles.headline}>
          Hello World, we are deployed in {process.env.NEXT_PUBLIC_ENV}!
        </h1>
      </div>

      <NewsFeed />
    </>
  );
}
