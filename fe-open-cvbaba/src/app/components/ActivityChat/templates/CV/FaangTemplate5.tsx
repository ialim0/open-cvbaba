import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

interface FAANGTemplate5Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FAANGTemplate5: React.FC<FAANGTemplate5Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 8 : 12;
  const basePadding = compact ? 4 : 20;
  const baseMargin = compact ? 2 : 10;
  
  const scaledStyles = {
    fontFamily: "'Times New Roman', Times, serif",
    maxWidth: `${800 * scale}px`,
    margin: '0 auto',
    padding: `${basePadding * scale}px`,
    lineHeight: 1.4,
    fontSize: `${baseFontSize * scale}px`,
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const headerLeftStyles = {
    width: '60%',
  };

  const headerRightStyles = {
    width: '40%',
    textAlign: 'right' as const,
  };

  const nameStyles = {
    fontSize: `${(compact ? 10 : 18) * scale}px`,
    fontWeight: 'bold',
    marginBottom: `${(compact ? 1 : 2) * scale}px`,
  };

  const subtitleStyles = {
    fontSize: `${(compact ? 5.5 : 11) * scale}px`,
    marginBottom: `${(compact ? 1 : 2) * scale}px`,
  };

  const contactInfoStyles = {
    fontSize: `${(compact ? 5.5 : 11) * scale}px`,
  };

  const contactLinkStyles = {
    color: '#000',
    textDecoration: 'none',
  };

  const sectionTitleStyles = {
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #000',
    margin: `${(compact ? 2 : 15) * scale}px 0 ${(compact ? 1 : 10) * scale}px 0`,
    paddingBottom: `${(compact ? 0.5 : 2) * scale}px`,
    fontSize: `${(compact ? 6.5 : 13) * scale}px`,
  };

  const itemStyles = {
    marginBottom: `${(compact ? 1 : 10) * scale}px`,
  };

  const itemTitleStyles = {
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const itemSubtitleStyles = {
    fontStyle: 'italic',
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const descriptionStyles = {
    marginLeft: `${(compact ? 2 : 15) * scale}px`,
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const listStyles = {
    listStyleType: 'none',
    marginLeft: `${(compact ? 2 : 15) * scale}px`,
  };

  const listItemStyles = {
    position: 'relative' as const,
    marginBottom: `${(compact ? 0.5 : 3) * scale}px`,
    paddingLeft: `${(compact ? 1.5 : 10) * scale}px`,
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const listItemBeforeStyles = {
    content: '"-"',
    position: 'absolute' as const,
    left: 0,
  };

  const skillsContainerStyles = {
    marginTop: `${(compact ? 1 : 5) * scale}px`,
  };

  const skillsCategoryStyles = {
    marginBottom: `${(compact ? 0.5 : 3) * scale}px`,
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const skillsBoldStyles = {
    fontWeight: 'bold',
  };

  const skillsListStyles = {
    marginLeft: `${(compact ? 2 : 15) * scale}px`,
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div
        className={`bg-white text-black font-serif ${className}`}
        style={scaledStyles}
      >
        <div style={headerStyles}>
          <div style={headerLeftStyles}>
            <h1 style={nameStyles}>Prashant Singh</h1>
            <div style={subtitleStyles}>Roll No.: xxxxxxx</div>
            <div style={subtitleStyles}>Bachelor of Technology</div>
            <div style={subtitleStyles}>Institute of Engineering and Management, Nagpur</div>
          </div>
          <div style={headerRightStyles}>
            <div style={contactInfoStyles}>
              <FontAwesomeIcon icon={faPhone} className="text-black" /> +91-xxxxxxxx
            </div>
            <div style={contactInfoStyles}>
              <FontAwesomeIcon icon={faEnvelope} className="text-black" /> prashant.xxxxx@gmail.com
            </div>
            <div style={contactInfoStyles}>
              <FontAwesomeIcon icon={faGithub} className="text-black" /> GitHub Profile
            </div>
            <div style={contactInfoStyles}>
              <FontAwesomeIcon icon={faLinkedin} className="text-black" /> LinkedIn Profile
            </div>
          </div>
        </div>

        <div style={sectionTitleStyles}>Education</div>
          <div style={itemStyles}>
            <div style={itemTitleStyles}>
              <span>Bachelor of Technology in Computer Science and Engineering(Cyber Security)</span>
              <span>2020-24</span>
            </div>
            <div style={itemSubtitleStyles}>Institute of Engineering and Management, Nagpur</div>
            <div>CGPA: 8.40 (Till 6th Semester)</div>
        </div>

        <div style={sectionTitleStyles}>Projects</div>
          <div style={itemStyles}>
            <div style={itemTitleStyles}>
              <span>Web Based Facial Authentication(License Detection)</span>
            </div>
          <div style={descriptionStyles}>A robust facial facial authentication system, implemented using a Chrome Extension.</div>
        </div>

        <div style={sectionTitleStyles}>Experience</div>
        <div style={itemStyles}>
          <div style={itemTitleStyles}>
            <span>AWS Educate Internship</span>
            <span>May - Aug 2023</span>
          </div>
          <div style={itemSubtitleStyles}>Online</div>
        </div>
      </div>
    );
  }

  // Full version for detailed preview
  return (
    <div
      className={`bg-white text-black font-serif ${className}`}
      style={scaledStyles}
    >
      <div style={headerStyles}>
        <div style={headerLeftStyles}>
          <h1 style={nameStyles}>Prashant Singh</h1>
          <div style={subtitleStyles}>Roll No.: xxxxxxx</div>
          <div style={subtitleStyles}>Bachelor of Technology</div>
          <div style={subtitleStyles}>Institute of Engineering and Management, Nagpur</div>
        </div>
        <div style={headerRightStyles}>
          <div style={contactInfoStyles}>
            <FontAwesomeIcon icon={faPhone} className="text-black" /> +91-xxxxxxxx
          </div>
          <div style={contactInfoStyles}>
            <FontAwesomeIcon icon={faEnvelope} className="text-black" /> prashant.xxxxx@gmail.com
          </div>
          <div style={contactInfoStyles}>
            <FontAwesomeIcon icon={faGithub} className="text-black" /> GitHub Profile
          </div>
          <div style={contactInfoStyles}>
            <FontAwesomeIcon icon={faLinkedin} className="text-black" /> LinkedIn Profile
          </div>
        </div>
      </div>

      <div style={sectionTitleStyles}>Education</div>
        <div style={itemStyles}>
          <div style={itemTitleStyles}>
            <span>Bachelor of Technology in Computer Science and Engineering(Cyber Security)</span>
            <span>2020-24</span>
          </div>
          <div style={itemSubtitleStyles}>Institute of Engineering and Management, Nagpur</div>
          <div>CGPA: 8.40 (Till 6th Semester)</div>
      </div>

      <div style={sectionTitleStyles}>Projects</div>
        <div style={itemStyles}>
          <div style={itemTitleStyles}>
            <span>Web Based Facial Authentication(License Detection)</span>
          </div>
          <div style={descriptionStyles}>A robust facial facial authentication system, implemented using a Chrome Extension.</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Facilitating users login to websites without having to remember their credentials</li>
            <li style={listItemStyles}>Reduces phishing and weak passwords and increases user login safety.</li>
          </ul>
        </div>

        <div style={itemStyles}>
          <div style={itemTitleStyles}>
            <span>Realtime Chat App</span>
          </div>
          <div style={descriptionStyles}>A chat application which allow users to chat in real time.</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Used Firebase for Authentication(BaaS) to firebase authentication & Cloud Firestore to store data.</li>
            <li style={listItemStyles}>Technology Used: ReactJS, Firebase, Bootstrap</li>
          </ul>
        </div>

        <div style={itemStyles}>
          <div style={itemTitleStyles}>
            <span>COVID-19 Tracker</span>
          </div>
          <div style={descriptionStyles}>Daily and weekly updated statistics showing the number of COVID-19 cases, recovered, and deaths.</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Working with real-time data, and using the REST API using disease.sh API and obtained.</li>
            <li style={listItemStyles}>Technology Used: React, Material-UI, Chart.js, Leaflet</li>
          </ul>
        </div>

      <div style={itemStyles}>
        <div style={itemTitleStyles}>
          <span>E-Commerce Platform</span>
        </div>
        <div style={descriptionStyles}>Full-stack e-commerce solution with payment integration and admin dashboard.</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Built with MERN stack (MongoDB, Express.js, React, Node.js)</li>
          <li style={listItemStyles}>Integrated Stripe payment gateway and implemented secure user authentication</li>
          <li style={listItemStyles}>Features include product catalog, shopping cart, order management, and analytics</li>
        </ul>
      </div>

      <div style={itemStyles}>
        <div style={itemTitleStyles}>
          <span>Machine Learning Price Predictor</span>
        </div>
        <div style={descriptionStyles}>Predictive model for real estate prices using machine learning algorithms.</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Trained multiple models including Linear Regression, Random Forest, and Neural Networks</li>
          <li style={listItemStyles}>Achieved 85% accuracy on test dataset with feature engineering and hyperparameter tuning</li>
          <li style={listItemStyles}>Technology Used: Python, scikit-learn, pandas, matplotlib, Flask</li>
        </ul>
      </div>

      <div style={sectionTitleStyles}>Experience</div>
        <div style={itemStyles}>
          <div style={itemTitleStyles}>
            <span>AWS Educate Internship</span>
            <span>May - Aug 2023</span>
          </div>
          <div style={itemSubtitleStyles}>Online</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>In-depth understanding of AWS cloud computing services, including EC2, S3, RDS, Lambda, IAM, VPC, and more.</li>
            <li style={listItemStyles}>Proficient in designing, deploying, and managing fault-tolerant, highly available, and scalable AWS solutions.</li>
            <li style={listItemStyles}>Gained experience in secured best practices, such as AWS Well-Architected Framework, security configurations.</li>
            <li style={listItemStyles}>Hands-On working with AWS Infrastructure provisioning, monitoring, and automation using AWS Management Console and AWS CLI.</li>
          </ul>
        </div>

        <div style={itemStyles}>
          <div style={itemTitleStyles}>
            <span>Oasis Asia Cybersecurity Virtual Internship</span>
            <span>Jun 2022 - Jul 2022</span>
          </div>
          <div style={itemSubtitleStyles}>Online</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Learned the fundamentals of Security Operations Center (SOC).</li>
            <li style={listItemStyles}>Learned basics of Network & Cloud Security.</li>
          </ul>
      </div>

      <div style={itemStyles}>
        <div style={itemTitleStyles}>
          <span>Software Development Intern</span>
          <span>Jan 2023 - Apr 2023</span>
        </div>
        <div style={itemSubtitleStyles}>TechStart Solutions, Mumbai</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Developed RESTful APIs using Node.js and Express.js for mobile application backend</li>
          <li style={listItemStyles}>Implemented user authentication and authorization using JWT tokens</li>
          <li style={listItemStyles}>Optimized database queries resulting in 30% improvement in response time</li>
          <li style={listItemStyles}>Collaborated with frontend team to integrate APIs and ensure seamless user experience</li>
        </ul>
      </div>

      <div style={sectionTitleStyles}>Technical Skills and Interests</div>
      <div style={skillsContainerStyles}>
        <div style={skillsCategoryStyles}><span style={skillsBoldStyles}>Languages:</span> C++, C, Python, JavaScript, TypeScript, HTML, CSS, Java, Go, Rust</div>
        <div style={skillsCategoryStyles}><span style={skillsBoldStyles}>Database Management System:</span> MongoDB, MySQL, PostgreSQL, Redis, Elasticsearch</div>
        <div style={skillsCategoryStyles}><span style={skillsBoldStyles}>Web Dev Tools:</span> NodeJS, ViteJS, Git, GitHub, Docker, Kubernetes, Jenkins</div>
        <div style={skillsCategoryStyles}><span style={skillsBoldStyles}>Cloud Technologies:</span> AWS (EC2, S3, Lambda, RDS, VPC), Google Cloud Platform, Azure</div>
        <div style={skillsCategoryStyles}><span style={skillsBoldStyles}>Frameworks & Libraries:</span> React, Angular, Vue.js, Express.js, Django, Flask, Spring Boot</div>
        <div style={skillsCategoryStyles}><span style={skillsBoldStyles}>Script Languages/Markup:</span> NetBeans IDE(java)/Intellij, Database(mySQL), LaTeX, Markdown</div>
        <div style={skillsCategoryStyles}><span style={skillsBoldStyles}>Areas of Interest:</span> Machine Learning, Computer Vision, Data Structures, Object Oriented Programming, Database Management Systems, Software Engineering, Cybersecurity, Cloud Computing</div>
        <div style={skillsCategoryStyles}><span style={skillsBoldStyles}>Areas of Interest:</span> Web Design and Development, Cloud Security, DevOps, Microservices Architecture, API Development</div>
        <div style={skillsCategoryStyles}><span style={skillsBoldStyles}>Co-curricular Activities:</span> Cricket, Adventure trips/trekking, Cycling/traveling, Photography, Open Source Contributions</div>
      </div>

      <div style={sectionTitleStyles}>Certifications</div>
      <ul style={listStyles}>
        <li style={listItemStyles}>AWS Certified Solutions Architect - Associate (2023)</li>
        <li style={listItemStyles}>Google Cloud Professional Cloud Developer (2023)</li>
        <li style={listItemStyles}>Certified Ethical Hacker (CEH) - EC-Council (2022)</li>
        <li style={listItemStyles}>Microsoft Azure Fundamentals (2022)</li>
        <li style={listItemStyles}>Cisco Certified Network Associate (CCNA) (2021)</li>
      </ul>

      <div style={sectionTitleStyles}>Achievements</div>
      <ul style={listStyles}>
        <li style={listItemStyles}>1st Place in National Hackathon - TechFest 2023 (Team of 4)</li>
        <li style={listItemStyles}>2nd Place in State-level Programming Competition - CodeWar 2022</li>
        <li style={listItemStyles}>Dean's List for Academic Excellence (6 consecutive semesters)</li>
        <li style={listItemStyles}>Best Project Award for Facial Authentication System - College Tech Expo 2023</li>
        <li style={listItemStyles}>Scholarship recipient for outstanding academic performance (2021-2024)</li>
      </ul>

      <div style={sectionTitleStyles}>Positions of Responsibility</div>
        <div style={itemStyles}>
          <div style={itemTitleStyles}>
            <span>On-Desk Registration Volunteer/ Android Cyber Week Event - IECSM, Nagpur</span>
            <span>Oct / Dec 2022</span>
          </div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Helped to attract close to 500 attendees to the event.</li>
            <li style={listItemStyles}>Collected over Rs. 20,000 in entry fees for different activities.</li>
          </ul>
        </div>

      <div style={itemStyles}>
        <div style={itemTitleStyles}>
          <span>Technical Head - Computer Science Society</span>
          <span>Aug 2021 - May 2023</span>
        </div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Organized 15+ technical workshops and coding competitions</li>
          <li style={listItemStyles}>Managed society's website and social media presence</li>
          <li style={listItemStyles}>Coordinated with industry professionals for guest lectures</li>
        </ul>
      </div>

      <div style={itemStyles}>
        <div style={itemTitleStyles}>
          <span>Mentor - Coding Bootcamp</span>
          <span>Jan 2023 - Present</span>
        </div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Mentored 20+ students in web development and programming fundamentals</li>
          <li style={listItemStyles}>Conducted weekly coding sessions and project reviews</li>
          <li style={listItemStyles}>Helped students build portfolio projects and prepare for technical interviews</li>
        </ul>
      </div>
    </div>
  );
};

export default FAANGTemplate5;