import styles from './loading.module.css';

export default async function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center gap-2">
        <div className={styles.spinner}>
          <div className={`${styles.spinnerRing} ${styles.spinnerRing1}`}></div>
          <div className={`${styles.spinnerRing} ${styles.spinnerRing2}`}></div>
          <div className={`${styles.spinnerRing} ${styles.spinnerRing3}`}></div>
        </div>
        <p className="text-default-500">Loading...</p>
      </div>
    </div>
  );
}
