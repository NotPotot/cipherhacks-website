import { ComponentType } from 'react';
import InstagramIcon from '../components/InstagramIcon';
import YouTubeIcon from '../components/YouTubeIcon';
import {
  CalendarIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  HeartIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  TrophyIcon,
  CodeBracketIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

// Event Details
export const EVENT_DATE: Date | null = new Date('2025-10-10T09:00:00'); // October 10-11, 2025
export const EVENT_LOCATION = 'San Diego Central Library Shiley Events Suite';

// ASCII Art
export const ASCII_ART = {
  logo: `
   ██████╗██╗██████╗ ██╗  ██╗███████╗██████╗ ██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗
  ██╔════╝██║██╔══██╗██║  ██║██╔════╝██╔══██╗██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝
  ██║     ██║██████╔╝███████║█████╗  ██████╔╝███████║███████║██║     █████╔╝ ███████╗
  ██║     ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗██╔══██║██╔══██║██║     ██╔═██╗ ╚════██║
  ╚██████╗██║██║     ██║  ██║███████╗██║  ██║██║  ██║██║  ██║╚██████╗██║  ██╗███████║
   ╚═════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝
                                                                       v1.0.0-beta
  `,
  rocket: `
    🚀
   /|\\
  / | \\
 /  |  \\
|   |   |
 '--|--'
    |
    |
  `,
  hack: `
   _    _          _____ _  __
  | |  | |   /\\   / ____| |/ /
  | |__| |  /  \\ | |    | ' / 
  |  __  | / /\\ \\| |    |  <  
  | |  | |/ ____ \\ |____| . \\ 
  |_|  |_/_/    \\_\\_____|_|\\_\\
  `,
};

// Terminal Text Animation System
const TERMINAL_MESSAGES = {
  bootCommands: [
    '$ ./launch_cipherhacks.sh',
    '$ sudo hack init --force',
    '$ chmod 777 imagination.py',
    '$ npm install @cipherhacks/awesome',
    '$ git commit -m "Initial chaos"',
    '$ docker run -d awesome-sauce',
  ],
  bootMessages: [
    '[INFO] Booting up CipherHacks 2025...',
    '[INFO] Initializing hackathon protocols...',
    '[INFO] Loading creative modules...',
    '[INFO] Preparing for epicness...',
    '[INFO] Starting up the matrix...',
    '[INFO] Q2lwaGVySGFja3N7UjByMTNuVF80X04zdzNSX1MzY3VyMXR5fQ== decryption module loaded...',
  ],
  hackerStats: [
    '[DEBUG] Found 1337 potential hackers in San Diego',
    '[DEBUG] Detected 42 coding wizards nearby',
    '[DEBUG] Scanning for caffeine-powered humans...',
    '[DEBUG] Located 404 sleep-deprived developers',
    '[DEBUG] Identified 101 future tech leaders',
  ],
  supplies: [
    '[SYSTEM] Loading caffeine supplies... ☕️',
    '[SYSTEM] Checking pizza reserves... 🍕',
    '[SYSTEM] Calculating energy drink levels... ⚡️',
    '[SYSTEM] Monitoring snack inventory... 🍪',
    '[SYSTEM] Preparing midnight ramen... 🍜',
  ],
  techModules: [
    '[DEBUG] Quantum encryption: ACTIVE',
    '[DEBUG] Neural networks: TRAINING',
    '[DEBUG] Blockchain: CHUNKY',
    '[DEBUG] AI models: SASSY',
    '[DEBUG] Cloud servers: FLUFFY',
    '[DEBUG] Firewalls: SPICY',
  ],
  memeStatus: [
    '[DEBUG] Memes: DANK',
    '[DEBUG] Meme quality: OVER 9000',
    '[DEBUG] Reddit integration: POGGERS',
    '[DEBUG] Joke module: DAD MODE',
    '[DEBUG] Vibes: IMMACULATE',
  ],
  funFeatures: [
    '[SYSTEM] Activating anti-gravity field...',
    '[SYSTEM] Engaging rubber duck debugger...',
    '[SYSTEM] Downloading more RAM...',
    '[SYSTEM] Feeding the code monkeys...',
    '[SYSTEM] Reticulating splines...',
  ],
  successMessages: [
    '[SUCCESS] Hack mode: ENABLED',
    '[SUCCESS] Maximum effort: ACTIVATED',
    '[SUCCESS] Beast mode: ENGAGED',
    '[SUCCESS] Pro gamer mode: ON',
    '[SUCCESS] Galaxy brain: EXPANDED',
  ],
  timeWarnings: [
    '[INFO] T-minus 48 hours until pure coding chaos',
    '[INFO] 172800 seconds of pure innovation ahead',
    '[INFO] Preparing for 2880 minutes of awesomeness',
    '[INFO] Time until coffee dependency: imminent',
  ],
  sleepReminders: [
    '[SYSTEM] Remember: Sleep is for the weak! (jk, please sleep)',
    '[SYSTEM] Warning: Excessive coding may cause spontaneous genius',
    '[SYSTEM] Fun fact: Bugs fear well-rested developers',
    '[SYSTEM] PSA: Sleeping occasionally improves code quality',
    '[SYSTEM] Note: Dreams are just offline coding sessions',
  ],
  finalCommands: [
    '$ echo "Ready to hack the planet? 🚀"',
    '$ echo "Time to show them what you got! 💪"',
    '$ echo "Let the games begin! 🎮"',
    '$ echo "May the code be with you! ⭐"',
    '$ echo "Challenge accepted! 🔥"',
  ],
};

const getRandomMessage = (messages: string[]) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

export const generateTerminalText = () => {
  return [
    getRandomMessage(TERMINAL_MESSAGES.bootCommands),
    getRandomMessage(TERMINAL_MESSAGES.bootMessages),
    getRandomMessage(TERMINAL_MESSAGES.hackerStats),
    getRandomMessage(TERMINAL_MESSAGES.supplies),
    getRandomMessage(TERMINAL_MESSAGES.supplies),
    getRandomMessage(TERMINAL_MESSAGES.techModules),
    getRandomMessage(TERMINAL_MESSAGES.techModules),
    getRandomMessage(TERMINAL_MESSAGES.memeStatus),
    getRandomMessage(TERMINAL_MESSAGES.funFeatures),
    getRandomMessage(TERMINAL_MESSAGES.successMessages),
    getRandomMessage(TERMINAL_MESSAGES.timeWarnings),
    getRandomMessage(TERMINAL_MESSAGES.sleepReminders),
    getRandomMessage(TERMINAL_MESSAGES.finalCommands),
  ].join('\n');
};

export const TERMINAL_TEXT = generateTerminalText();

// Navigation Items
export const NAV_ITEMS = [
  { name: 'CipherHacks', icon: CodeBracketIcon, to: 'hero', primary: true, className: 'hidden lg:flex' },
  { name: 'About', icon: InformationCircleIcon, to: 'about', className: 'flex' },
  { name: 'FAQ', icon: QuestionMarkCircleIcon, to: 'faq', className: 'flex' },
  { name: 'Sponsors', icon: HeartIcon, to: 'sponsors', className: 'flex' },
  { name: 'Donators', icon: CurrencyDollarIcon, to: 'donators', className: 'flex' },
  { name: 'Team', icon: UserGroupIcon, to: 'team', className: 'flex' },
  { name: 'Contact', icon: RocketLaunchIcon, to: 'contact', className: 'flex' }
];

export const NAV_ACTION_BUTTONS = [
  {
    name: 'Register',
    icon: UserGroupIcon,
    href: '/register',
    className: 'bg-atom-blue animate-glow-blue'
  },
  {
    name: 'Discord',
    icon: ChatBubbleLeftRightIcon,
    href: 'https://cipherhacks.tech/discord',
    className: 'bg-atom-purple animate-glow-purple'
  },
  {
    name: 'Volunteer',
    icon: HeartIcon,
    href: '/volunteer',
    className: 'bg-atom-purple'
  },
  {
    name: 'Schedule',
    icon: CalendarIcon,
    action: 'openSchedule',
    className: 'bg-atom-orange'
  },
  {
    name: 'Donate',
    icon: HeartIcon,
    href: 'https://cipherhacks.tech/donate',
    className: 'bg-atom-green'
  },
  {
    name: 'Sponsor',
    icon: DocumentTextIcon,
    href: 'https://cipherhacks.tech/sponsor',
    className: 'bg-atom-orange'
  }
];

// Features Section
export const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: "Cybersecurity Focus",
    description: "Dive deep into the world of cybersecurity. Learn about encryption, network security, and ethical hacking from industry experts.",
    color: "text-atom-green"
  },
  {
    icon: UserGroupIcon,
    title: "Beginner Friendly",
    description: "New to coding or cybersecurity? No problem! We'll provide workshops, mentorship, and resources to help you succeed.",
    color: "text-atom-blue"
  },
  {
    icon: LightBulbIcon,
    title: "Learn & Build",
    description: "Get hands-on experience with real-world security tools and technologies while building your own innovative solutions.",
    color: "text-atom-orange"
  },
  {
    icon: TrophyIcon,
    title: "Amazing Prizes",
    description: "Compete for exciting prizes while gaining valuable experience and networking with industry professionals.",
    color: "text-atom-purple"
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: "Expert Mentorship",
    description: "Connect with experienced mentors from leading tech companies who will guide you throughout the hackathon.",
    color: "text-atom-cyan"
  },
  {
    icon: RocketLaunchIcon,
    title: "Launch Your Journey",
    description: "Kickstart your journey in tech and cybersecurity. Create lasting connections and discover new opportunities.",
    color: "text-atom-blue"
  }
];

// About Section
export const HERO_ITEMS = [
  { icon: CalendarIcon, text: 'October 10-11, 2025' },
  { icon: MapPinIcon, text: '330 Park Blvd, San Diego Central Library' },
  { icon: CommandLineIcon, text: 'All Skill Levels Welcome' }
];

export const WHAT_TO_EXPECT = [
  { emoji: '🚀', text: 'Hands-on workshops led by industry experts' },
  { emoji: '💡', text: 'One-on-one mentorship from tech professionals' },
  { emoji: '🏆', text: 'Exciting prizes and swag for winners' },
  { emoji: '🤝', text: 'Networking with fellow tech enthusiasts' },
  { emoji: '🍕', text: 'Delicious meals and refreshments' },
  { emoji: '🎮', text: 'Fun activities and mini-events' }
];

// FAQ Section
export const FAQ_ITEMS = [
  {
    q: "Who can participate?",
    a: "Any high school student in the San Diego area! No coding experience required. We welcome beginners and experienced coders alike."
  },
  {
    q: "What should I bring?",
    a: "Your laptop, charger, student ID, and enthusiasm for learning! We'll provide all the necessary tools and resources."
  },
  {
    q: "Is it free?",
    a: "Yes! Thanks to our generous sponsors, CipherHacks is completely free for all participants. This includes meals, swag, and access to all workshops."
  },
  {
    q: "Will there be food?",
    a: "Absolutely! We provide all meals, snacks, and drinks throughout the event. We accommodate dietary restrictions - just let us know in advance!"
  },
  {
    q: "Do I need a team?",
    a: "Not at all! You can come solo and form a team during our team formation event, or bring your own team of up to 4 members."
  },
  {
    q: "What can I build?",
    a: "Anything! The theme of this hackathon is Cybersecurity, so you can build anything related to that. Web apps, mobile apps, games, hardware projects - if you can dream it, you can build it. We'll have mentors to help guide you."
  }
];

// Sponsors Section
export interface SponsorInfo {
  name: string;
  description?: string;
  specialStyle?: string;
  popupUrl?: string;
  popupUrlText?: string;
  contribution?: string;
  logo?: string; // URL to sponsor logo image
  website?: string;
}

export const SPONSOR_TIERS = [
  {
    tier: "PARTNER",
    color: "text-purple-400",
    icon: "🤝",
    sponsors: [
      { 
        name: "HCB", 
        description: "Hack Club is a 501(c)(3) nonprofit that supports thousands of student-run coding clubs and events worldwide. As CipherHacks' fiscal sponsor, they handle our donation processing, insurance, and financial oversight so the hackathon can stay free and accessible to every student.",
        website: "https://hackclub.com/hcb", 
        contribution: "Fiscal Sponsor",
        logo: "/sponsors/hcb-icon-icon-dark.png"
      },
      
    ]
  },
  {
    tier: "DIAMOND",
    color: "text-blue-400",
    icon: "💎",
    sponsors: []
  },
  {
    tier: "GOLD",
    color: "text-yellow-400",
    icon: "🏅",
    sponsors: [
      {
        name: "Yubico",
        contribution: "In-kind donation",
        description: "Yubico is supporting CipherHacks with 30 YubiKeys, industry-leading security keys for strong two-factor authentication. These keys will be available for teams to use during the hackathon and awarded as prizes, giving students hands-on experience with professional-grade security tools.",
        website: "https://yubico.com",
        logo: "/sponsors/yubico.png"
      },
    ]
  },
  {
    tier: "SILVER",
    color: "text-gray-300",
    icon: "🥈",
    sponsors: [
      {
        name: "Sublime Text & Merge",
        contribution: "In-kind donation",
        description: "Sublime HQ is supporting CipherHacks with five license keys for its flagship tools, Sublime Text and Sublime Merge. These licenses will be awarded as participant prizes, giving our student coders professional-grade software for future projects.",
        website: "https://sublimetext.com",
        logo: "/sponsors/sublime_light_logos.png"
      },
      {
        name: "theCoderSchool",
        contribution: "In-kind donation",
        description: "theCoderSchool is a San Diego coding academy that gives kids and teens personalized, semi-private coaching in Python, Java, game development, and more. They're fueling CipherHacks by donating month-long class passes to our winning teams, so students can keep leveling up long after the hackathon ends.",
        website: "https://thecoderschool.com",
        logo: "/sponsors/coderschool.png"
      },
      {
        name: "Jukebox Print",
        contribution: "In-kind donation",
        description: "Big shoutout to Jukebox for our custom stickers!",
        website: "https://www.jukeboxprint.com/custom-stickers",
        logo: "/sponsors/jukeboxprint_logo_trans.png",
        specialStyle: "pink-glow",
      },
      {
        name: `O'Reilly`,
        contribution: "In-kind donation",
        description: "For over 40 years O’Reilly has provided technology and business training, knowledge, and insight to help companies succeed. Their unique network of experts and innovators share their knowledge and expertise through books, articles, and our online learning platform. O’Reilly online learning gives you on-demand access to live training courses, in-depth learning paths, interactive coding environments, certification prep materials, and a vast collection of text and video from O’Reilly and 200+ other publishers. O'Reilly is providing a free 30-day subscription to their learning platform for all attendees.",
        website: "https://www.oreilly.com/",
        logo: "/sponsors/oreilly_logo.png"
      },
      {
        name: `XYZ`,
        contribution: "In-kind donation",
        description: "Participants can use the .xyz domains to hone their skills creating websites. XYZ is offering 10 .xyz domains that are free for the first year to CipherHacks participants.",
        website: "https://gen.xyz/",
        logo: "/sponsors/xyzlogo.png"
      }
    ]
  }
];

// Donators Section
export interface DonatorInfo {
  name: string;
  amount: number; // in USD
  message?: string; // optional message from donator
  date?: string; // donation date
  isAnonymous?: boolean;
}

export const DONATORS: DonatorInfo[] = [
  // Add donators here as they come in
  // Example:
  // { name: "John Doe", amount: 100, message: "Keep up the great work!", date: "2025-01-15" },
  {name: "Anonymous Donor", amount: 500, date: "08-28-2025"},
  {name: "Virendra Chahal", amount: 100, date: "08-06-2025"},
  {name: "Ladan Esfandiari", amount: 100, date: "09-28-2025"},
  {name: "Wang Family", amount: 100, date: "10-01-2025"},
  {name: "Ying Chen", amount: 50, date: "10-03-2025"},
  {name: "Douglas Doerrige", amount: 50, date: "10-04-2025"},
  {name: "Anonymous Donor", amount: 50, date: "10-04-2025"},
  {name: "Virendra Chahal", amount: 100, date: "10-06-2025"}

];

// HCB (Hack Club Bank) transparency link
export const HCB_TRANSPARENCY_URL = "https://hcb.hackclub.com/cipherhacks/transactions";

// Contact Section
export const CONTACT_EMAIL = "team@cipherhacks.tech";

interface SocialLink {
  name: string;
  icon: ComponentType<{ className?: string }>;
  link: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "GitHub",
    icon: CodeBracketIcon,
    link: "https://github.com/cipherhackz"
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
    link: "https://instagram.com/cipherhacks2025"
  },
  {
    name: 'YouTube',
    icon: YouTubeIcon,
    link: 'https://www.youtube.com/@cipherhacks',
  },
  {
    name: "Email",
    icon: EnvelopeIcon,
    link: "mailto:team@cipherhacks.tech"
  }
];

// Team Section
export interface TeamMember {
  name: string;
  role: string;
  description: string;
  image?: string; // URL to profile image (optional)
  gender: 'male' | 'female' | 'other';
  links: {  
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Arshan Shokoohi",
    role: "Founder & Head Director",
    description: "Senior at Rancho Bernardo High School, passionate about computer science, cybersecurity and making tech education accessible to all.",
    image: "/team/arshan.jpg",
    gender: "male",
    links: {
      website: "https://arshan.dev",
      github: "https://github.com/arshansgithub",
      linkedin: "https://www.linkedin.com/in/arshanshokoohi/",
      email: "arshan@cipherhacks.tech"
    }
  },
  {
    name: "Elijah Reuben Agcaoili",
    role: "Head Director",
    description: "Senior at Rancho Bernardo High School, passionate about administration, technology, and making a positive impact in our community.",
    image: "/team/elijah.jpg",
    gender: "male",
    links: {
      email: "elijah@cipherhacks.tech"
    }
  },
  {
    name: "Wyatt Gill",
    role: "Director",
    description: "Freshman at Francis Parker High School, passionate about Low Level systems, Cybersecurity and AI.",
    image: "/team/wyatt.jpg",
    gender: "male",
    links: {
      website: "https://wyattgill9.github.io",
      github: "https://github.com/wyattgill9",
      linkedin: "https://www.linkedin.com/in/wyatt-gill-17380b323",
      email: "wyatt@cipherhacks.tech",
    }
  },
  {
    name: "Kevin Wang",
    role: "Director",
    description: "Senior at Rancho Bernardo High School, passionate about AI and computer science for social good.",
    image: "/team/kevin.png",
    gender: "male",
    links: {
      email: "kevin@cipherhacks.tech"
    }
  },
  {
    name: "Aaran Chahal",
    role: "Director",
    description: "Sophomore at Rancho Bernardo High School, passionate about computer science and AI for innovation.",
    image: "/team/aaran.jpg",
    gender: "male",
    links: {
      github: "https://github.com/a-chahal",
      email: "aaran@cipherhacks.tech"
    }
  },
  {
    name: "Jonathan Le",
    role: "Social Media Director",
    description: "Senior at Rancho Bernardo High School, passionate in stem education specializing in finance management and marketing.",
    image: "/team/jonathan.jpeg",
    gender: "male",
    links: {
      linkedin: "https://www.linkedin.com/in/jonathan-le-036796342",
      email: "jonathan@cipherhacks.tech"
    }
  },
  {
    name: "Gabe Santos",
    role: "Outreach Director",
    description: "Senior at Rancho Bernardo High School, passionate in stem education specializing in outreach and community engagement.",
    image: "/team/gabe.jpeg",
    gender: "male",
    links: {
      email: "team@cipherhacks.tech"
    }
  }
  
];

// Terminal Commands
interface Command {
  name: string;
  description: string;
  usage?: string;
  action: (args: string[]) => string | Promise<string>;
}

export const COMMANDS: Command[] = [
  {
    name: 'help',
    description: 'Show available commands',
    action: () => `Available commands:
${COMMANDS.map(cmd => `  ${cmd.name.padEnd(15)} - ${cmd.description}`).join('\n')}

Type 'info <command>' for more details about a specific command.`,
  },
  {
    name: 'info',
    description: 'Get detailed information about a command',
    action: (args) => {
      const commandName = args[0];
      const command = COMMANDS.find(c => c.name === commandName);
      if (!command) {
        return `Command not found: ${commandName}. Type "help" for available commands.`;
      }
      return `Command: ${command.name}
Description: ${command.description}
Usage: ${command.name} ${command.usage || ''}`;
    }
  },
  {
    name: 'about',
    description: 'Learn about CipherHacks',
    action: () => makeClickable(`${ASCII_ART.logo}
CipherHacks is San Diego's premier high school hackathon, focusing on cybersecurity and innovation.
Join us for an unforgettable weekend of coding, learning, and building alongside fellow students 
passionate about technology.

🗓️ Date: October 10-11, 2025
📍 Location: San Diego Central Library Shiley Events Suite
📍 Address: 330 Park Blvd, San Diego, CA 92101
💻 Format: In-person hackathon
🎯 Focus: Cybersecurity & Computer Science
👥 Who: High school students in San Diego

Visit our website: https://cipherhacks.tech
Follow us on Instagram: https://instagram.com/cipherhacks2025
`)
  },
  {
    name: 'status',
    description: 'Check current event status',
    action: () => makeClickable(`🚀 CipherHacks 2025 Status:

Registration: Not yet open
Interest Form: OPEN - https://cipherhacks.tech/register
Location: San Diego Central Library Shiley Events Suite
Address: 330 Park Blvd, San Diego, CA 92101
Date: October 10-11, 2025
Sponsorships: Open for discussion

Want to stay updated? Fill out the interest form!`)
  },
  {
    name: 'register',
    description: 'Get registration information',
    action: () => makeClickable(`${ASCII_ART.rocket}
🎉 Registration Status: Coming Soon!

While registration isn't open yet, you can:
1. Fill out our interest form: https://cipherhacks.tech/register
2. Follow us on social media for updates

We'll notify you as soon as registration opens!`)
  },
  {
    name: 'schedule',
    description: 'View event schedule (TBA)',
    action: () => `📅 Schedule Status: To Be Announced

The detailed schedule will be released closer to the event date.
We're working hard to create an exciting lineup of:
- Engaging workshops
- Technical talks
- Fun activities
- Networking sessions
- And more!

Stay tuned for updates! Use 'notify' command to sign up for notifications.`
  },
  {
    name: 'faq',
    description: 'View frequently asked questions',
    action: () => makeClickable(`❓ Frequently Asked Questions:

Q: Who can participate?
A: Any high school student in the San Diego area! No coding experience required.

Q: How much does it cost?
A: CipherHacks is completely FREE thanks to our sponsors!

Q: Do I need a team?
A: Nope! You can come solo and form a team during our team formation event.

Q: What should I bring?
A: Laptop, charger, student ID, and enthusiasm for learning!

Q: Will there be food?
A: Yes! We provide all meals and snacks during the event.

More questions? Email us: team@cipherhacks.tech`)
  },
  {
    name: 'sponsors',
    description: 'View sponsorship information',
    action: () => makeClickable(`💎 Sponsorship Opportunities

Interested in sponsoring? We'd love to have you join us in empowering the next generation
of cybersecurity professionals and innovators!

Benefits include:
- Brand exposure to talented high school students
- Recruitment opportunities
- Community impact
- Tax deductions (through Hack Club's 501(c)(3) status)

Contact us:
- Email: sponsors@cipherhacks.tech
- Visit: https://cipherhacks.tech/sponsor`)
  },
  {
    name: 'team',
    description: 'Meet the organizing team',
    action: () => makeClickable(`👥 CipherHacks Team:

Arshan Shokoohi
Role: Creator of CipherHacks
About: Senior at Rancho Bernardo High School
GitHub: https://github.com/arshansgithub
LinkedIn: https://www.linkedin.com/in/arshanshokoohi/

Kevin Wang
Role: Program Director
About: Senior at Rancho Bernardo High School, passionate about AI and computer science for social good.

Aaran Chahal
Role: Director
About: Sophomore at Rancho Bernardo High School, passionate about computer science and AI for innovation.
GitHub: https://github.com/a-chahal

Want to join the team? Email us at team@cipherhacks.tech`)
  },
  {
    name: 'notify',
    description: 'Sign up for notifications',
    action: () => makeClickable(`🔔 Stay Updated!

Choose how you'd like to receive updates:
1. Fill out the interest form: https://cipherhacks.tech/register
2. Follow on Instagram: @cipherhacks2025

We'll notify you about:
- Registration opening
- Schedule updates
- Workshop announcements
- Important deadlines`)
  },
  {
    name: 'clear',
    description: 'Clear the terminal',
    action: () => ''
  },
  {
    name: 'whoami',
    description: 'Display current user',
    action: () => 'hacker@cipherhacks'
  },
  {
    name: 'pwd',
    description: 'Print working directory',
    action: () => '/home/hacker/cipherhacks'
  },
  {
    name: 'ls',
    description: 'List directory contents',
    action: () => `drwxr-xr-x  2 hacker  cipherhacks  4096 Oct  4 09:00 about
drwxr-xr-x  2 hacker  cipherhacks  4096 Oct  4 09:00 schedule
drwxr-xr-x  2 hacker  cipherhacks  4096 Oct  4 09:00 register
drwxr-xr-x  2 hacker  cipherhacks  4096 Oct  4 09:00 sponsors
-rw-r--r--  1 hacker  cipherhacks  1337 Oct  4 09:00 README.md
-rwxrwxrwx  1 root    cipherhacks   666 Oct  4 13:37 .hidden`
  },
  {
    name: 'nmap',
    description: 'Network discovery and security auditing',
    action: (args) => {
      if (args.length === 0) {
        return `nmap: At least one host must be specified
Usage: nmap [target]
Try 'nmap localhost' or 'nmap -sS target' for stealth scan`;
      }
      const target = args[0];
      if (target === 'localhost' || target === '127.0.0.1') {
        // Add the network-scan class to body temporarily for CSS steganography
        document.body.classList.add('network-scan');
        setTimeout(() => document.body.classList.remove('network-scan'), 5000);
        return `Starting Nmap scan on ${target}...

PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
1337/tcp open  elite-hacker-port
8080/tcp open  http-proxy

Nmap done: 1 IP address scanned, encrypted payloads detected in CSS layer.
Advanced hackers should inspect element styles for hidden transmissions.`;
      }
      return `Scanning ${target}... Permission denied. Target may be protected by advanced security measures.`;
    }
  },
  {
    name: 'netstat',
    description: 'Display network connections',
    action: () => {
      document.body.classList.add('security-protocol');
      setTimeout(() => document.body.classList.remove('security-protocol'), 3000);
      return `Active Internet connections:
Proto Local Address    Foreign Address   State
tcp   0.0.0.0:80       *.*               LISTEN
tcp   0.0.0.0:443      *.*               LISTEN  
tcp   127.0.0.1:1337   127.0.0.1:31415   ESTABLISHED

Warning: Unusual activity detected on port 1337.
Security protocols activated. Check CSS pseudo-elements for system diagnostics.`;
    }
  },
  {
    name: 'wireshark',
    description: 'Network protocol analyzer',
    action: () => `Wireshark-style packet capture initiated...

=== PACKET CAPTURE LOG ===
[13:37:42] TCP 192.168.1.100:1337 → 10.0.0.1:80 [SYN]
[13:37:42] HTTP GET /api/v1/flags HTTP/1.1
[13:37:43] Response: 200 OK
[13:37:43] Payload: ZmxhZ3tzM2NyM3RfaDNhZDNyX2ZvdW5kfQ==

Packet analysis complete. Base64 encoded payloads detected.
Experienced penetration testers know where to look... 🕵️‍♂️`
  },
  {
    name: 'mirage',
    description: 'Toggle Mirage Shield protection',
    usage: '[on|off|status]',
    action: (args) => {
      const sub = (args[0] || '').toLowerCase();
      const toggle = (window as any).__toggleMirage;
      const isEnabled = () => (window as any).__mirageEnabled;

      if (sub === 'status') {
        return `🛡️ Mirage Shield Status:
  Client Protection:  ${isEnabled() ? '✅ ACTIVE' : '❌ DISABLED'}
  Honeypot Fields:    ${isEnabled() ? '✅ Injected' : '⬚ Inactive'}
  Behavior Tracking:  ${isEnabled() ? '✅ Monitoring' : '⬚ Stopped'}
  Headless Detection: ${isEnabled() ? '✅ Scanning' : '⬚ Off'}
  Report Endpoint:    /api/cipherhacks/report

  Server Middleware:  ✅ ACTIVE (Hono/Cloudflare Workers)
  Rate Limiting:      ✅ Enabled (high sensitivity)`;
      }

      if (sub === 'on') {
        if (isEnabled()) return '🛡️ Mirage Shield is already active.';
        toggle(true);
        return `🛡️ Mirage Shield ENABLED
  ✅ Client-side protections activated
  ✅ Honeypot fields injected
  ✅ Behavior tracking started
  ✅ Headless browser detection online`;
      }

      if (sub === 'off') {
        if (!isEnabled()) return '🛡️ Mirage Shield is already disabled.';
        toggle(false);
        return `⚠️ Mirage Shield DISABLED
  ❌ Client-side protections deactivated
  ❌ Honeypot fields removed
  ❌ Behavior tracking stopped
  ⚠️  Server-side middleware remains active`;
      }

      return `🛡️ Mirage Shield — AI threat protection by @mirageshield/mirage

Usage: mirage [on|off|status]

  on      Enable client-side protection
  off     Disable client-side protection
  status  Show current shield status

Server-side middleware (rate limiting, payload analysis) cannot be toggled from the client.`;
    }
  },
  {
    name: 'cat',
    description: 'Display file contents',
    action: (args) => {
      if (args.length === 0) {
        return 'cat: missing file operand';
      }
      const filename = args[0];
      if (filename === '.hidden') {
        return `# CLASSIFIED SECURITY BRIEFING
# Access Level: Elite Hacker
#
# Subject: Advanced Penetration Testing Protocols
# Date: October 10, 2025
#
# The following are hints for dedicated security researchers:
#
# 1. Terminal boot sequences may contain Base64 encoded intelligence
# 2. Browser inspection tools reveal obfuscated cipher challenges  
# 3. Network scanning activates CSS-based steganographic protocols
# 4. ROT13 is an ancient cipher, but still useful for modern challenges
#
# Remember: True hackers don't just read source code - they reverse engineer!
# 
# Encrypted Message: PvcureUnpxf{G3zu_Jbex_Qbar_Jryy}
# (Hint: This message uses a simple substitution cipher)`;
      }
      return `cat: ${filename}: No such file or directory`;
    }
  },
];

// Helper function for making text clickable
const makeClickable = (text: string) => {
  // Convert URLs to clickable links with special formatting
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" class="text-atom-blue hover:underline cursor-pointer">$1</a>'
  );
}; 
