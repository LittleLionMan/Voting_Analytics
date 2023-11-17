import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      

      <div className={styles.center}>
        <h1>Welcome</h1>
      </div>

      <div className={styles.grid}>
        <Link
          href="inputform"
          className={styles.card}
        >
          <h2>
            App <span>-&gt;</span>
          </h2>
          <p>Click here to get some nifty infos about voting distribution for the proposal of your choice</p>
        </Link>
      </div>
    </main>
  )
}