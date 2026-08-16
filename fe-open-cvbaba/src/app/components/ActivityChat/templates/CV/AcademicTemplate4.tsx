import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faBuilding, faGlobe, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

interface AcademicTemplate4Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const AcademicTemplate4: React.FC<AcademicTemplate4Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 10 : 15;
  const basePadding = compact ? 4 : 30;
  const baseMargin = compact ? 2 : 20;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.4,
    color: '#2c3e50',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    background: '#fff',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
    borderBottom: '2px solid #000',
    paddingBottom: `${(compact ? 3 : 15) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 12 : 24) * scale}px`,
    color: '#2c3e50',
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
    fontWeight: 'bold',
  };

  const titleStyles = {
    color: '#000',
    fontSize: `${(compact ? 8 : 16) * scale}px`,
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const contactInfoStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: `${(compact ? 2 : 8) * scale}px`,
    fontSize: `${(compact ? 5 : 10) * scale}px`,
  };

  const contactItemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: `${(compact ? 1 : 3) * scale}px`,
  };

  const sectionStyles = {
    margin: `${(compact ? 4 : 20) * scale}px 0`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 7 : 14) * scale}px`,
    color: '#000',
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    display: 'flex',
    alignItems: 'center',
    gap: `${(compact ? 2 : 8) * scale}px`,
  };

  const sectionTitleAfterStyles = {
    content: '""',
    flex: 1,
    height: '1px',
    background: '#e0e0e0',
  };

  const researchTagsStyles = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: `${(compact ? 1 : 6) * scale}px`,
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const tagStyles = {
    background: '#f7f9fc',
    border: '1px solid #000',
    color: '#000',
    padding: `${(compact ? 1 : 3) * scale}px ${(compact ? 2 : 8) * scale}px`,
    borderRadius: `${(compact ? 2 : 12) * scale}px`,
    fontSize: `${(compact ? 4 : 10) * scale}px`,
  };

  const publicationStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    paddingLeft: `${(compact ? 3 : 15) * scale}px`,
  };

  const pubTitleStyles = {
    color: '#2c3e50',
    fontWeight: 'bold',
  };

  const pubAuthorsStyles = {
    color: '#666',
    fontStyle: 'italic',
    fontSize: `${(compact ? 4 : 10) * scale}px`,
  };

  const pubVenueStyles = {
    color: '#000',
    fontSize: `${(compact ? 4 : 10) * scale}px`,
  };

  const metricsStyles = {
    display: 'inline-block',
    background: '#f7f9fc',
    padding: `${(compact ? 1 : 2) * scale}px ${(compact ? 1 : 4) * scale}px`,
    borderRadius: `${(compact ? 1 : 2) * scale}px`,
    fontSize: `${(compact ? 3 : 9) * scale}px`,
    color: '#666',
  };

  const experienceItemStyles = {
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
  };

  const experienceHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const institutionStyles = {
    fontWeight: 'bold',
  };

  const dateStyles = {
    color: '#666',
    fontSize: `${(compact ? 4 : 10) * scale}px`,
  };

  const listStyles = {
    listStyleType: 'none',
    marginLeft: `${(compact ? 3 : 12) * scale}px`,
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    position: 'relative' as const,
    fontSize: `${(compact ? 4 : 10) * scale}px`,
  };

  const listItemBeforeStyles = {
    content: '"•"',
    color: '#000',
    position: 'absolute' as const,
    left: `${-(compact ? 3 : 12) * scale}px`,
  };

  const skillsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: `${(compact ? 3 : 15) * scale}px`,
  };

  const skillCategoryStyles = {
    background: '#f7f9fc',
    padding: `${(compact ? 2 : 8) * scale}px`,
    borderRadius: `${(compact ? 1 : 4) * scale}px`,
  };

  const skillTitleStyles = {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    fontSize: `${(compact ? 5 : 12) * scale}px`,
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div 
        className={`bg-white text-black font-sans ${className}`}
        style={scaledStyles}
      >
        {/* Header */}
        <div style={headerStyles}>
          <div style={nameStyles}>Dr. Alex R. Zhang</div>
          <div style={titleStyles}>Senior Research Scientist - Machine Learning & AI</div>
          <div style={contactInfoStyles}>
            <div style={contactItemStyles}><FontAwesomeIcon icon={faEnvelope} className="text-black" /> zhang.a@ailab.edu</div>
            <div style={contactItemStyles}><FontAwesomeIcon icon={faChalkboardTeacher} className="text-black" /> scholar.google.com/zhang</div>
            <div style={contactItemStyles}><FontAwesomeIcon icon={faGithub} className="text-black" /> github.com/azhang</div>
            <div style={contactItemStyles}><FontAwesomeIcon icon={faBuilding} className="text-black" /> AI Research Lab, Berkeley</div>
          </div>
        </div>

        {/* Research Focus */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Research Focus
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={researchTagsStyles}>
            <span style={tagStyles}>Large Language Models</span>
            <span style={tagStyles}>Multimodal Learning</span>
            <span style={tagStyles}>AI Alignment</span>
            <span style={tagStyles}>Reinforcement Learning</span>
            <span style={tagStyles}>Transformer Models</span>
          </div>
        </div>

        {/* Selected Publications */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Selected Publications
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={publicationStyles}>
            <div style={pubTitleStyles}>"Scaling Laws in Large Language Models: A Multi-Modal Perspective"</div>
            <div style={pubAuthorsStyles}>Zhang, A., Johnson, M., et al.</div>
            <div style={pubVenueStyles}>NeurIPS 2023</div>
            <span style={metricsStyles}>Citations: 156</span>
          </div>
          <div style={publicationStyles}>
            <div style={pubTitleStyles}>"Self-Aligning Language Models through Reinforcement Learning"</div>
            <div style={pubAuthorsStyles}>Zhang, A., Smith, R., Brown, K.</div>
            <div style={pubVenueStyles}>ICML 2023</div>
            <span style={metricsStyles}>Citations: 89</span>
          </div>
        </div>

        {/* Research Experience */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Research Experience
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={experienceItemStyles}>
            <div style={experienceHeaderStyles}>
              <span style={institutionStyles}>DeepMind</span>
              <span style={dateStyles}>2021 - Present</span>
            </div>
            <div>Senior Research Scientist</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Lead researcher on large-scale language model alignment</li>
              <li style={listItemStyles}>Developed novel architecture for efficient training of multi-modal models</li>
              <li style={listItemStyles}>Published 8 papers in top-tier conferences (h-index: 15)</li>
            </ul>
          </div>
        </div>

        {/* Technical Expertise */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Technical Expertise
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={skillsGridStyles}>
            <div style={skillCategoryStyles}>
              <div style={skillTitleStyles}>Deep Learning</div>
              PyTorch, TensorFlow, JAX, Transformers
            </div>
            <div style={skillCategoryStyles}>
              <div style={skillTitleStyles}>Languages</div>
              Python, C++, Julia
            </div>
            <div style={skillCategoryStyles}>
              <div style={skillTitleStyles}>Tools & Platforms</div>
              Docker, Kubernetes, AWS
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full version for detailed preview
  return (
    <div 
      className={`bg-white text-black font-sans ${className}`}
      style={scaledStyles}
    >
      {/* Header */}
      <div style={headerStyles}>
        <div style={nameStyles}>Dr. Alex R. Zhang</div>
        <div style={titleStyles}>Senior Research Scientist - Machine Learning & AI</div>
        <div style={contactInfoStyles}>
          <div style={contactItemStyles}><FontAwesomeIcon icon={faEnvelope} className="text-black" /> zhang.a@ailab.edu</div>
          <div style={contactItemStyles}><FontAwesomeIcon icon={faChalkboardTeacher} className="text-black" /> scholar.google.com/zhang</div>
          <div style={contactItemStyles}><FontAwesomeIcon icon={faGithub} className="text-black" /> github.com/azhang</div>
          <div style={contactItemStyles}><FontAwesomeIcon icon={faBuilding} className="text-black" /> AI Research Lab, Berkeley</div>
          <div style={contactItemStyles}><FontAwesomeIcon icon={faPhone} className="text-black" /> (510) 555-0123</div>
          <div style={contactItemStyles}><FontAwesomeIcon icon={faGlobe} className="text-black" /> alexzhang.ai</div>
        </div>
      </div>

      {/* Research Focus */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Research Focus
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={researchTagsStyles}>
          <span style={tagStyles}>Large Language Models</span>
          <span style={tagStyles}>Multimodal Learning</span>
          <span style={tagStyles}>AI Alignment</span>
          <span style={tagStyles}>Reinforcement Learning</span>
          <span style={tagStyles}>Transformer Models</span>
          <span style={tagStyles}>Neural Architecture Search</span>
          <span style={tagStyles}>Federated Learning</span>
          <span style={tagStyles}>AI Safety</span>
          <span style={tagStyles}>Computer Vision</span>
          <span style={tagStyles}>Natural Language Processing</span>
        </div>
      </div>

      {/* Education */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Education
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Ph.D. in Computer Science</span>
            <span style={dateStyles}>2016-2021</span>
          </div>
          <div>Stanford University, Stanford, CA</div>
          <div>Thesis: "Scaling Laws and Emergent Capabilities in Large Language Models"</div>
          <div>Advisor: Professor Christopher Manning; GPA: 3.98/4.00</div>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>M.S. in Machine Learning</span>
            <span style={dateStyles}>2014-2016</span>
          </div>
          <div>Carnegie Mellon University, Pittsburgh, PA</div>
          <div>Focus: Deep Learning and Natural Language Processing; GPA: 3.95/4.00</div>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>B.S. in Computer Science, Summa Cum Laude</span>
            <span style={dateStyles}>2010-2014</span>
          </div>
          <div>University of California, Berkeley, Berkeley, CA</div>
          <div>Minor: Mathematics; Phi Beta Kappa; GPA: 3.97/4.00</div>
        </div>
      </div>

      {/* Academic Appointments */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Academic Appointments
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Senior Research Scientist</span>
            <span style={dateStyles}>2021 - Present</span>
          </div>
          <div>DeepMind, London, UK</div>
          <div>Leading research on large-scale language model alignment and multimodal learning</div>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Postdoctoral Researcher</span>
            <span style={dateStyles}>2020-2021</span>
          </div>
          <div>Google AI Research, Mountain View, CA</div>
          <div>Research on transformer architectures and scaling laws for language models</div>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Research Intern</span>
            <span style={dateStyles}>Summer 2019</span>
          </div>
          <div>OpenAI, San Francisco, CA</div>
          <div>Research on GPT-3 and large-scale language model training</div>
        </div>
      </div>

      {/* Selected Publications */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Selected Publications
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={publicationStyles}>
          <div style={pubTitleStyles}>"Scaling Laws in Large Language Models: A Multi-Modal Perspective"</div>
          <div style={pubAuthorsStyles}>Zhang, A., Johnson, M., Chen, L., Smith, R., Brown, K., Davis, S.</div>
          <div style={pubVenueStyles}>NeurIPS 2023 (Oral Presentation)</div>
          <span style={metricsStyles}>Citations: 156 | Impact Factor: 8.5</span>
        </div>

        <div style={publicationStyles}>
          <div style={pubTitleStyles}>"Self-Aligning Language Models through Reinforcement Learning from Human Feedback"</div>
          <div style={pubAuthorsStyles}>Zhang, A., Smith, R., Brown, K., Wilson, T., Garcia, M.</div>
          <div style={pubVenueStyles}>ICML 2023 (Spotlight)</div>
          <span style={metricsStyles}>Citations: 89 | Impact Factor: 7.2</span>
        </div>

        <div style={publicationStyles}>
          <div style={pubTitleStyles}>"Multimodal Learning with Vision-Language Transformers: A Comprehensive Survey"</div>
          <div style={pubAuthorsStyles}>Zhang, A., Lee, H., Chen, X., Taylor, R., Martinez, A.</div>
          <div style={pubVenueStyles}>Journal of Machine Learning Research 2023</div>
          <span style={metricsStyles}>Citations: 67 | Impact Factor: 6.8</span>
        </div>

        <div style={publicationStyles}>
          <div style={pubTitleStyles}>"Neural Architecture Search for Efficient Transformer Models"</div>
          <div style={pubAuthorsStyles}>Zhang, A., Thompson, P., White, S., Anderson, M., Davis, L.</div>
          <div style={pubVenueStyles}>ICLR 2022 (Oral Presentation)</div>
          <span style={metricsStyles}>Citations: 45 | Impact Factor: 5.9</span>
        </div>

        <div style={publicationStyles}>
          <div style={pubTitleStyles}>"Federated Learning for Privacy-Preserving AI: Challenges and Solutions"</div>
          <div style={pubAuthorsStyles}>Zhang, A., Wilson, T., Garcia, M., Brown, K., Smith, R.</div>
          <div style={pubVenueStyles}>AAAI 2022</div>
          <span style={metricsStyles}>Citations: 34 | Impact Factor: 4.2</span>
        </div>

        <div style={publicationStyles}>
          <div style={pubTitleStyles}>"Emergent Capabilities in Large Language Models: A Scaling Analysis"</div>
          <div style={pubAuthorsStyles}>Zhang, A., Johnson, M., Chen, L., Smith, R.</div>
          <div style={pubVenueStyles}>Nature Machine Intelligence 2021</div>
          <span style={metricsStyles}>Citations: 123 | Impact Factor: 9.8</span>
        </div>
      </div>

      {/* Research Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Research Experience
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>DeepMind</span>
            <span style={dateStyles}>2021 - Present</span>
          </div>
          <div>Senior Research Scientist, London, UK</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Lead researcher on large-scale language model alignment, developing novel methods for AI safety and human-AI interaction.</li>
            <li style={listItemStyles}>Developed novel architecture for efficient training of multi-modal models, reducing computational cost by 50% while maintaining performance.</li>
            <li style={listItemStyles}>Published 12 papers in top-tier conferences (NeurIPS, ICML, ICLR) with 800+ total citations and h-index of 18.</li>
            <li style={listItemStyles}>Led team of 8 researchers and engineers in developing next-generation AI systems for scientific discovery.</li>
            <li style={listItemStyles}>Collaborated with DeepMind's AlphaFold team on protein structure prediction using large language models.</li>
            <li style={listItemStyles}>Mentored 6 Ph.D. interns and 4 postdoctoral researchers, contributing to their career development and research success.</li>
          </ul>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Google AI Research</span>
            <span style={dateStyles}>2020-2021</span>
          </div>
          <div>Postdoctoral Researcher, Mountain View, CA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Conducted research on transformer architectures and scaling laws for language models, contributing to GPT-3 development.</li>
            <li style={listItemStyles}>Developed novel attention mechanisms that improved efficiency of large language models by 30%.</li>
            <li style={listItemStyles}>Published 4 papers in top-tier conferences and journals during postdoctoral position.</li>
            <li style={listItemStyles}>Collaborated with Google's Brain team on multimodal learning and computer vision applications.</li>
          </ul>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>OpenAI</span>
            <span style={dateStyles}>Summer 2019</span>
          </div>
          <div>Research Intern, San Francisco, CA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Conducted research on GPT-3 and large-scale language model training, contributing to model architecture improvements.</li>
            <li style={listItemStyles}>Developed novel methods for efficient fine-tuning of large language models on downstream tasks.</li>
            <li style={listItemStyles}>Collaborated with OpenAI's research team on AI safety and alignment research.</li>
          </ul>
        </div>
      </div>

      {/* Grants & Funding */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Grants & Funding
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>NSF CAREER Award</span>
            <span style={dateStyles}>$750,000</span>
          </div>
          <div>"Advancing AI Safety through Large Language Model Alignment" (2023-2028)</div>
          <div>Principal Investigator; Focus on developing safe and aligned AI systems</div>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Google Research Award</span>
            <span style={dateStyles}>$500,000</span>
          </div>
          <div>"Multimodal Learning for Scientific Discovery" (2022-2025)</div>
          <div>Co-Principal Investigator; Developing AI systems for scientific research</div>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>DeepMind Research Fellowship</span>
            <span style={dateStyles}>$300,000</span>
          </div>
          <div>"Neural Architecture Search for Efficient AI Models" (2021-2024)</div>
          <div>Principal Investigator; Research on efficient AI model architectures</div>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Stanford Graduate Fellowship</span>
            <span style={dateStyles}>$200,000</span>
          </div>
          <div>"Large Language Models and Emergent Capabilities" (2016-2021)</div>
          <div>Full tuition and stipend for doctoral studies</div>
        </div>
      </div>

      {/* Teaching & Mentorship */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Teaching & Mentorship
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Advanced Machine Learning (CS 229)</span>
            <span style={dateStyles}>Fall 2023</span>
          </div>
          <div>Stanford University, Graduate Course</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Co-taught graduate-level course on advanced machine learning topics including deep learning, NLP, and computer vision.</li>
            <li style={listItemStyles}>Supervised 15 Ph.D. and Master's theses on topics including large language models, multimodal learning, and AI safety.</li>
            <li style={listItemStyles}>Received outstanding teaching evaluations (4.9/5.0 average) from 60 students.</li>
          </ul>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Introduction to Artificial Intelligence (CS 221)</span>
            <span style={dateStyles}>Spring 2022</span>
          </div>
          <div>Stanford University, Undergraduate Course</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Taught fundamental concepts of artificial intelligence to 120+ undergraduate students.</li>
            <li style={listItemStyles}>Designed hands-on programming assignments using PyTorch and TensorFlow.</li>
          </ul>
        </div>

        <div style={experienceItemStyles}>
          <div style={experienceHeaderStyles}>
            <span style={institutionStyles}>Guest Lecturer</span>
            <span style={dateStyles}>2020-Present</span>
          </div>
          <div>Various Universities and Conferences</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Delivered invited lectures on "Large Language Models" and "AI Safety" at 15+ institutions worldwide.</li>
            <li style={listItemStyles}>Presented at major conferences including NeurIPS, ICML, ICLR, and AAAI.</li>
          </ul>
        </div>
      </div>

      {/* Technical Expertise */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Technical Expertise
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={skillsGridStyles}>
          <div style={skillCategoryStyles}>
            <div style={skillTitleStyles}>Deep Learning</div>
            PyTorch, TensorFlow, JAX, Transformers, Hugging Face, Weights & Biases
          </div>
          <div style={skillCategoryStyles}>
            <div style={skillTitleStyles}>Programming Languages</div>
            Python (Expert), C++ (Advanced), Julia (Advanced), R (Intermediate), JavaScript (Intermediate)
          </div>
          <div style={skillCategoryStyles}>
            <div style={skillTitleStyles}>ML Frameworks</div>
            Scikit-learn, XGBoost, LightGBM, Ray, MLflow, Optuna, Hydra
          </div>
          <div style={skillCategoryStyles}>
            <div style={skillTitleStyles}>Cloud Platforms</div>
            Google Cloud Platform (Expert), AWS (Advanced), Azure (Intermediate), Kubernetes
          </div>
          <div style={skillCategoryStyles}>
            <div style={skillTitleStyles}>Development Tools</div>
            Docker, Git, Linux, VS Code, Jupyter, Apache Spark, Apache Kafka
          </div>
          <div style={skillCategoryStyles}>
            <div style={skillTitleStyles}>Specialized Tools</div>
            CUDA, OpenMP, MPI, Slurm, Weights & Biases, TensorBoard, Neptune
          </div>
        </div>
      </div>

      {/* Service & Leadership */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Service & Leadership
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <ul style={listStyles}>
          <li style={listItemStyles}><strong>Program Committee Member:</strong> NeurIPS (2020-Present), ICML (2021-Present), ICLR (2022-Present), AAAI (2023-Present)</li>
          <li style={listItemStyles}><strong>Area Chair:</strong> NeurIPS 2023, ICML 2023, ICLR 2024</li>
          <li style={listItemStyles}><strong>Editorial Board:</strong> Journal of Machine Learning Research (2022-Present), IEEE Transactions on Pattern Analysis and Machine Intelligence (2023-Present)</li>
          <li style={listItemStyles}><strong>Conference Organization:</strong> Workshop Co-Chair, NeurIPS 2023; Tutorial Chair, ICML 2023</li>
          <li style={listItemStyles}><strong>Reviewer:</strong> Nature Machine Intelligence, Science, Nature, IEEE TPAMI, IJCV, TACL</li>
          <li style={listItemStyles}><strong>Mentorship:</strong> DeepMind Mentorship Program (2021-Present), Stanford Women in AI (2020-2021)</li>
          <li style={listItemStyles}><strong>Diversity & Inclusion:</strong> Co-founder, Asians in AI Research (AAIR) organization</li>
        </ul>
      </div>

      {/* Awards & Honors */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Awards & Honors
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <ul style={listStyles}>
          <li style={listItemStyles}><strong>DeepMind Excellence Award</strong> (2023) - Recognition for outstanding contributions to AI research</li>
          <li style={listItemStyles}><strong>Outstanding Paper Award, NeurIPS 2023</strong> - For work on scaling laws in large language models</li>
          <li style={listItemStyles}><strong>Google Research Excellence Award</strong> (2021) - Recognition for postdoctoral research contributions</li>
          <li style={listItemStyles}><strong>Stanford Graduate Fellowship</strong> (2016-2021) - Full tuition and stipend for doctoral studies</li>
          <li style={listItemStyles}><strong>UC Berkeley Chancellor's Scholar</strong> (2010-2014) - Recognition for academic excellence</li>
          <li style={listItemStyles}><strong>Phi Beta Kappa</strong> (2013) - Inducted as junior for academic excellence</li>
        </ul>
      </div>

      {/* Professional Memberships */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Professional Memberships
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Association for Computing Machinery (ACM)</li>
          <li style={listItemStyles}>Institute of Electrical and Electronics Engineers (IEEE)</li>
          <li style={listItemStyles}>Association for the Advancement of Artificial Intelligence (AAAI)</li>
          <li style={listItemStyles}>Asians in AI Research (AAIR)</li>
          <li style={listItemStyles}>Black in AI</li>
        </ul>
      </div>
    </div>
  );
};

export default AcademicTemplate4;