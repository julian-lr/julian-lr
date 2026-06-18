import styles from './Projects.module.scss'

interface Project {
  title: string
  technologies: string[]
  status: ('Completed' | 'In Progress' | 'Planned' | 'Deprecated')[]
  url: string
  image: string
}

const projects: Project[] = [
  {
    title: 'Web Development Course Coderhouse',
    technologies: ['HTML5', 'CSS3', 'SCSS', 'Bootstrap', 'Google Fonts'],
    status: ['Completed'],
    url: 'https://github.com/julian-lr/Web-Development-CH-JLR',
    image: '/img/previews/preview-ch-wd.png',
  },
  {
    title: 'JavaScript Course Coderhouse',
    technologies: ['JavaScript', 'DOM API', 'Local Storage', 'Fetch API', 'Toastify.js', 'Bootstrap'],
    status: ['Completed'],
    url: 'https://github.com/julian-lr/JavaScript-CH-JLR',
    image: '/img/previews/preview-ch-js.png',
  },
  {
    title: 'ReactJS Course Coderhouse',
    technologies: ['React', 'Vite', 'Firebase', 'React Router', 'Context API', 'SweetAlert2'],
    status: ['Completed'],
    url: 'https://github.com/julian-lr/ReactJS-CH-JLR',
    image: '/img/previews/preview-ch-react.png',
  },
  {
    title: 'Email Demo',
    technologies: ['HTML Email', 'CSS', 'Email Templates'],
    status: ['Completed'],
    url: 'https://github.com/julian-lr/Email-demo-JLR',
    image: '/img/previews/preview-e-mail.png',
  },
    {
        title: 'This portfolio website',
        technologies: ['React 19', 'TypeScript', 'Vite', 'SCSS Modules', 'Cloudflare Pages', 'Resend API'],
    status: ['In Progress'],
        url: 'https://github.com/julian-lr/julian-lr',
    image: '/img/previews/preview-portfolio.png',
  },
  {
    title: 'AllNighter v2',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    status: ['Completed', 'Deprecated'],
    url: 'https://github.com/julian-lr/AllNighter',
    image: '/img/previews/preview-allnighter.png',
  },
]

function Projects() {
  return (
    <section className={styles.projects}>
      <h2>Dev Projects</h2>
      <div className={styles.projectGrid}>
        {projects.map((project, idx) => (
          <a
            key={idx}
            href={project.url}
            className={styles.projectCard}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div 
              className={styles.cardBackground}
              style={{ backgroundImage: `url(${project.image})` }}
            >
              <div className={styles.cardOverlay}>
                <div className={styles.cardContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <div className={styles.projectDetails}>
                    <div className={styles.statusTags}>
                      {project.status.map((statusItem, statusIdx) => (
                        <span key={statusIdx} className={`${styles.status} ${styles[statusItem.toLowerCase().replace(' ', '')]}`}>
                          {statusItem}
                        </span>
                      ))}
                    </div>
                    <div className={styles.techTags}>
                      {project.technologies.map((tech, techIdx) => (
                        <span key={techIdx} className={styles.tech}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Projects
