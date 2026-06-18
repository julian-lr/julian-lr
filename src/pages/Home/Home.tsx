import styles from './Home.module.scss'
import profileImg from '../../assets/img/profile/pfp.jpg'

function Home() {
  return (
    <section className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.photoWrapper}>
          <img
            src={profileImg}
            alt="Profile"
            className={styles.photo}
          />
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>
            Julián <span className={styles.highlight}>Laurito Riscica</span>
          </h1>
          <div className={styles.roles}>
            <span>Martech Specialist</span>
            <span> • </span>
            <span>Frontend Dev</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
