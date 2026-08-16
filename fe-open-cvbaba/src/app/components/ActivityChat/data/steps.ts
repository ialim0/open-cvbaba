// steps.ts
export interface Step {
    label: string;
    description: string;
    weight: number;
    details: {
      what: string;
      actions: string[];
      output: string;
    };
  }


export const steps: Step[] = [
    {
      label: 'Personal Information',
      description: 'Building your professional identity',
      weight: 10,
      details: {
        what: 'Establishing your professional presence with key contact details',
        actions: [
          'Full name and professional title',
          'Contact information (email, phone, location)',
          'Professional online presence (LinkedIn, portfolio)',
        ],
        output: 'Professional header section that makes you instantly reachable',
      },
    },
    {
      label: 'Professional Experience',
      description: 'Crafting your career narrative',
      weight: 35,
      details: {
        what: 'Structuring your work history to showcase growth and achievements',
        actions: [
          'Company details and position titles',
          'Key responsibilities and achievements',
          'Quantifiable results and metrics',
        ],
        output: 'Compelling work history that demonstrates your impact and progression',
      },
    },
    {
      label: 'Skills Analysis',
      description: 'Mapping your expertise',
      weight: 25,
      details: {
        what: 'Identifying and organizing your technical and soft skills',
        actions: [
          'Technical skills relevant to target roles',
          'Soft skills backed by experience',
          'Tools and technologies expertise levels',
        ],
        output: 'Comprehensive skills section aligned with industry demands',
      },
    },
    {
      label: 'Education & Certifications',
      description: 'Validating your knowledge',
      weight: 15,
      details: {
        what: 'Presenting your academic achievements and professional development',
        actions: [
          'Formal education details',
          'Professional certifications',
          'Relevant coursework and training',
        ],
        output: 'Educational background that supports your professional profile',
      },
    },
    {
      label: 'Final Optimization',
      description: 'Perfecting your presentation',
      weight: 15,
      details: {
        what: 'Ensuring your resume is polished and ATS-friendly',
        actions: [
          'Format consistency and visual hierarchy',
          'ATS keyword optimization',
          'Final proofreading and refinements',
        ],
        output: 'Refined, ATS-optimized resume ready for submission',
      },
    },
];