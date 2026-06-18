import styles from './AboutMe.module.scss'

function AboutMe() {
  return (
    <section className={styles.aboutMe}>
      <div className="scrollableContent">
        <div className={styles.centeredContent}>
          <h2>About me</h2>
          <p>
            Hi! I’m Julián, a Salesforce Marketing Cloud and Marketing Operations specialist with nearly 8 years of experience across email marketing, QA, campaign execution, automation, and martech solutions.
          </p>
          <p>
            My background combines hands-on technical expertise with a strong operational mindset. I’ve worked across the full campaign lifecycle, from planning, segmentation, data extensions, QA, testing, and deployment, to automation health checks, journey optimization, reporting, and process improvement. Over the years, I’ve supported large-scale marketing programs for regional and global brands, helping teams improve consistency, efficiency, and performance across email, SMS, push, and customer engagement channels.
          </p>
          <p>
            I enjoy understanding how marketing technology works behind the scenes and how it can be used to create better, more scalable customer experiences. My experience in Salesforce Marketing Cloud includes Email Studio, Journey Builder, Automation Studio, Data Extensions, SQL-based segmentation, QA processes, naming conventions, documentation, and cross-functional collaboration with marketing, creative, analytics, and technology teams.
          </p>
          <p>
            Beyond execution, I’m especially interested in marketing operations, campaign planning, governance, and the strategic side of martech. I like connecting technical details with business goals, making sure that every process, automation, and campaign setup supports both operational efficiency and measurable impact.
          </p>
          <p>
            Based in Buenos Aires, I hold dual Argentinian-Italian citizenship and speak English and Spanish fluently, with basic Portuguese. I’m also pursuing a BBA to strengthen my understanding of business, organizations, and strategic decision-making, with the goal of continuing to grow as a well-rounded professional who brings both technical expertise and marketing operations insight to the table.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutMe
