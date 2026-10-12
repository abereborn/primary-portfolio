export type DevelopmentStage = {
  id: string;
  step: number;
  name: string;
  eyebrow: string;
  description: string;
  actions: string[];
  technologies: string[];
  primaryTools: string[];
  output: string;
  tagline: string;
};

export const developmentFlow: DevelopmentStage[] = [
  {
    id: "idea",
    step: 1,
    name: "IDEA",
    eyebrow: "01",
    description: "Define the problem and shape the product direction.",
    actions: ["Problem definition", "Target user", "Product goals", "Core features"],
    technologies: [],
    primaryTools: ["Notion", "Figma"],
    output: "Clear product direction",
    tagline: "Define the problem. Shape the direction.",
  },

  {
    id: "planning",
    step: 2,
    name: "PLANNING",
    eyebrow: "02",
    description: "Turn the idea into a technical blueprint.",
    actions: ["Requirements", "User flow", "Feature planning", "System architecture", "Tech stack selection", "Database planning"],
    technologies: [],
    primaryTools: ["Notion", "Architecture / Diagram Tools"],
    output: "Technical blueprint",
    tagline: "Structure the product. Plan how everything connects.",
  },

  {
    id: "design",
    step: 3,
    name: "DESIGN",
    eyebrow: "03",
    description: "Turn the blueprint into a clear user experience.",
    actions: ["Wireframes", "User interface", "Visual system", "Responsive planning", "Prototype"],
    technologies: [],
    primaryTools: ["Figma"],
    output: "Ready-to-build interface",
    tagline: "Plan the experience. Design the interface.",
  },

  {
    id: "frontend",
    step: 4,
    name: "FRONTEND",
    eyebrow: "04",
    description: "Turn the design into a working interface.",
    actions: ["Component development", "Responsive implementation", "UI interactions", "Animation", "API integration"],
    technologies: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Tailwind CSS"],
    primaryTools: ["React", "TypeScript", "JavaScript"],
    output: "Working user interface",
    tagline: "Build the interface. Make it responsive. Make it interactive.",
  },

  {
    id: "backend",
    step: 5,
    name: "BACKEND",
    eyebrow: "05",
    description: "Build the logic behind the interface.",
    actions: ["API development", "Business logic", "Authentication", "Data processing", "Frontend integration"],
    technologies: ["Java", "Spring Boot", "CodeIgniter", "REST API", "MySQL", "PostgreSQL"],
    primaryTools: ["Java", "Spring Boot", "REST API"],
    output: "Connected application",
    tagline: "Build the logic. Connect the system.",
  },

  {
    id: "testing",
    step: 6,
    name: "TEST",
    eyebrow: "06",
    description: "Validate the product before it reaches production.",
    actions: ["Functional testing", "API testing", "UI testing", "Responsive testing", "Bug fixing", "Validation"],
    technologies: [],
    primaryTools: ["Browser DevTools", "API Testing", "Git"],
    output: "Production-ready build",
    tagline: "Find the issues. Fix the details. Verify the product.",
  },

  {
    id: "deployment",
    step: 7,
    name: "DEPLOY",
    eyebrow: "07",
    description: "Take the finished product live.",
    actions: ["Version control", "Build", "CI/CD", "Environment configuration", "Deployment", "Production verification"],
    technologies: ["Git", "GitHub", "Docker", "GitHub Actions", "CI/CD", "Vercel"],
    primaryTools: ["GitHub", "Docker", "CI/CD", "Vercel"],
    output: "LIVE PRODUCT",
    tagline: "Ship the product. Make it live.",
  },
];

/** Phrases typed out behind the machine; each one continues the word "Prototype". */
export const backdropPhrases: readonly string[] = [
  "Prototype the idea.",
  "Prototype fast. Learn faster.",
  "Prototype, test, refine.",
  "Prototype today. Ship tomorrow.",
  "Prototype. Build. Test. Ship.",
];
