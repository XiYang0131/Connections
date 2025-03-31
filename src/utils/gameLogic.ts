import { Category, Word } from '../types';

const categories: Category[] = [
  {
    name: "Programming Languages",
    words: ["Python", "JavaScript", "Ruby", "Java", "Swift", "Rust", "Go", "Kotlin"],
    color: "bg-yellow-200",
    solved: false,
    hint: "These help computers understand what to do"
  },
  {
    name: "Data Structures",
    words: ["Array", "Queue", "Stack", "Tree", "Graph", "Hash", "Heap", "List"],
    color: "bg-green-200",
    solved: false,
    hint: "Organizing data in specific ways"
  },
  {
    name: "Design Patterns",
    words: ["Singleton", "Observer", "Factory", "Builder", "Proxy", "Command", "State", "Bridge"],
    color: "bg-blue-200",
    solved: false,
    hint: "Common solutions to software design problems"
  },
  {
    name: "Database Terms",
    words: ["Index", "Query", "Schema", "Join", "View", "Trigger", "Table", "Key"],
    color: "bg-purple-200",
    solved: false,
    hint: "Essential concepts in data management"
  },
  {
    name: "Cloud Services",
    words: ["Lambda", "EC2", "S3", "Azure", "Heroku", "Docker", "Kubernetes", "Firebase"],
    color: "bg-red-200",
    solved: false,
    hint: "Modern infrastructure and deployment platforms"
  },
  {
    name: "Web Protocols",
    words: ["HTTP", "HTTPS", "FTP", "SSH", "SMTP", "DNS", "TCP", "UDP"],
    color: "bg-orange-200",
    solved: false,
    hint: "Standards for internet communication"
  },
  {
    name: "Frontend Frameworks",
    words: ["React", "Vue", "Angular", "Svelte", "Solid", "Qwik", "Astro", "Next"],
    color: "bg-pink-200",
    solved: false,
    hint: "Tools for building web user interfaces"
  },
  {
    name: "Version Control",
    words: ["Git", "Branch", "Merge", "Commit", "Push", "Pull", "Clone", "Fork"],
    color: "bg-indigo-200",
    solved: false,
    hint: "Managing code changes and collaboration"
  },
  {
    name: "Cryptography Terms",
    words: ["Hash", "Salt", "Cipher", "RSA", "AES", "HMAC", "Nonce", "PKI"],
    color: "bg-emerald-200",
    solved: false,
    hint: "Securing data and communications"
  },
  {
    name: "Linux Commands",
    words: ["grep", "awk", "sed", "curl", "chmod", "sudo", "ping", "cron"],
    color: "bg-amber-200",
    solved: false,
    hint: "Essential terminal operations"
  },
  {
    name: "HTTP Status Codes",
    words: ["200", "201", "301", "400", "403", "404", "500", "502"],
    color: "bg-lime-200",
    solved: false,
    hint: "Web response indicators"
  },
  {
    name: "Machine Learning",
    words: ["CNN", "RNN", "BERT", "LSTM", "GAN", "SVM", "KNN", "GPT"],
    color: "bg-cyan-200",
    solved: false,
    hint: "AI and neural network architectures"
  },
  {
    name: "Software Testing",
    words: ["Unit", "Mock", "Stub", "E2E", "TDD", "BDD", "Jest", "Mocha"],
    color: "bg-fuchsia-200",
    solved: false,
    hint: "Ensuring code quality"
  },
  {
    name: "Web Security",
    words: ["CORS", "XSS", "CSRF", "JWT", "OAuth", "HTTPS", "WAF", "CSP"],
    color: "bg-rose-200",
    solved: false,
    hint: "Protecting web applications"
  },
  {
    name: "DevOps Tools",
    words: ["Jenkins", "Travis", "GitLab", "Circle", "Ansible", "Puppet", "Chef", "Helm"],
    color: "bg-violet-200",
    solved: false,
    hint: "Automation and deployment tools"
  },
  {
    name: "Database Types",
    words: ["MySQL", "Mongo", "Redis", "Neo4j", "Cassan", "Elastic", "Fauna", "Postgres"],
    color: "bg-teal-200",
    solved: false,
    hint: "Different ways to store data"
  }
];

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getDailyOffset = () => {
  const start = new Date('2024-01-01').getTime();
  const today = new Date().getTime();
  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
};

export const generateGame = (): { categories: Category[]; words: Word[]; date: string } => {
  const offset = getDailyOffset();
  const today = new Date().toISOString().split('T')[0];
  
  // Use the daily offset to deterministically select categories
  const selectedCategories = categories
    .slice(offset % (categories.length - 3), (offset % (categories.length - 3)) + 4)
    .map(cat => ({ ...cat, solved: false }));
  
  // Create words array
  const words: Word[] = selectedCategories.flatMap(category =>
    category.words.slice(0, 4).map(word => ({
      text: word,
      category: category.name,
      selected: false
    }))
  );

  // Use the offset as a seed for shuffling
  const shuffledWords = shuffleArray(words);

  return {
    categories: selectedCategories,
    words: shuffledWords,
    date: today
  };
};

export const checkSelection = (selectedWords: Word[]): boolean => {
  if (selectedWords.length !== 4) return false;
  const category = selectedWords[0].category;
  return selectedWords.every(word => word.category === category);
};