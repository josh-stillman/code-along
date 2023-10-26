'use client';
import useSWR from 'swr';
import { NewsItemsResponse } from '../../types/api';
import styles from './NewsFeed.module.css';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const params = new URLSearchParams();

params.set('sort', 'publishedAt:desc');

export function NewsFeed() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data, error, isLoading } = useSWR<NewsItemsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/news-items?${params.toString()}`,
    fetcher
  );

  return (
    <div className={styles.newsItemList}>
      <div className={styles.headerContainer}>
        <h1 className={styles.hero}>NewsFeed!</h1>

        <div
          className={`${styles.newspaper} ${
            isLoading
              ? styles['newspaper--loading']
              : styles['newspaper--settled']
          }`}
        >
          🗞
        </div>
      </div>

      <div className={styles.itemsContainer}>
        {!isLoading &&
          !error &&
          data?.data.map(({ attributes, id }) => (
            <div key={id} className={styles.newsItem}>
              <h2 className={styles.headline}>{attributes.Title}</h2>

              <h3 className={styles.body}>
                <i>{attributes.Body}</i>
              </h3>

              <span>
                {new Date(attributes.publishedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
