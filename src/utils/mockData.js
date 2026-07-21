// TODO: replace with real API data

export const mockUserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@gmail.com",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAxFZ8zEAQzn58df4W8I3cgMxUp8C3ACQ2VwC3u7opQ4hhSpaacmPvBiFX4iGLCl0SD1t0ZH4zS_4wE4SLOQWJFLU1DlqrSw97zWIOT5AnWwj6U5QQDgeY7t6nEhAuY_OmQJENcp8JHwpOhaJ3-kD91fhliobyJ-i6U6qdmrFTK4BFOGSlMLrvQDUi9eygfQubXrJiCkmFcwyEoVFtkBpMYpE-ohuQ861NAFOojI6QqBm5PGjuWJuKPw",
  role: "Senior Software Engineer",
  targetCompany: "Meta",
  targetRole: "Product Engineer",
  stats: {
    interviewsCompleted: 12,
    averageScore: 84,
    resumeScore: 82,
    atsCompatibility: 94,
    practiceHours: 18.5,
    streak: 5
  }
};

export const mockResumes = [
  {
    id: 1,
    name: "Senior_SWE_v4.pdf",
    date: "2 days ago",
    matchScore: 84,
    size: "2.4 MB"
  },
  {
    id: 2,
    name: "Product_Engineer_Rev.pdf",
    date: "1 week ago",
    matchScore: 72,
    size: "1.8 MB"
  },
  {
    id: 3,
    name: "General_SWE_Resume.pdf",
    date: "3 weeks ago",
    matchScore: 68,
    size: "2.1 MB"
  }
];

export const mockPersonas = [
  {
    id: "friendly-hr",
    name: "Sarah Lin",
    role: "Friendly HR Recruiter",
    difficulty: "Easy",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3lETbgUKvSgiyB68CbFDYVuyYpX8xIpmJk-JLie8cpBYPDOQxoSUT-hmqBoqAvDmzuQQR3dkDMAOZEhbKk05AmM1uY4k8R5oUPOjON8o-fs7R5tspB_VXfXGOPGK7GkHCGt5w_hR6yYa52PX_APlsNj6LJU1SaZY8lixBbTEoj9ryic_9Zo9uKKqc-euQDfix7HOnFVBFHjRo9oBvYZPIqm478FFr_f_8Qy3BM7O9-fWgBBSRVDwVfg",
    description: "Focuses on culture fit, career motivations, and basic communication skills. Friendly, encouraging, and patient tone."
  },
  {
    id: "strict-tech-lead",
    name: "Marcus Vance",
    role: "Strict Tech Lead",
    difficulty: "Hard",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRLEoHHKtTz7qaFyKzr9Qr-pZBwsuRy2BJEGQyrTZ7LxhdnDlaJ-VZXRuA4XEr-9lHoYkHKzCclNNQMBvXaSgIP-FmA-zaDwEC5DgjeEXsEc3pTt-c2wt_eq4sDffqRHQ0pVT7UuPFxoYMKjjjmhOxEVR_EMLQhLC_fkBtPHoc1iFYheK04TGQZsHYCoJDDySpDP8ZMdhUcIQuTk35Ow-5uXouysGE6osu6X7H_oOWYUjBBXM4d3-mPw",
    description: "Deep dive technical questions, system design challenges, and code efficiency optimization. Direct and challenging tone."
  }
];

export const mockInterviews = [
  {
    id: "1",
    title: "Software Engineer Mock",
    company: "Meta",
    date: "May 18, 2026",
    score: 84,
    duration: "18 mins",
    personaName: "Marcus Vance",
    status: "Completed",
    overallFeedback: "Strong technical competency shown in system design. Work on structuring behavior responses using the STAR method.",
    categories: {
      technical: 88,
      communication: 79,
      behavioral: 85
    },
    transcript: [
      {
        role: "interviewer",
        text: "Can you explain the difference between optimistic and pessimistic locking, and when you would use each?",
        time: "0:12",
        feedback: null
      },
      {
        role: "user",
        text: "Sure. Optimistic locking assumes that multiple transactions can complete without affecting each other. It checks for conflicts before committing. Pessimistic locking blocks resources to prevent conflicts. I'd use optimistic locking in low-conflict read-heavy scenarios.",
        time: "0:45",
        feedback: {
          type: "good",
          text: "Excellent explanation and correct architectural recommendation."
        }
      },
      {
        role: "interviewer",
        text: "How would you handle a sudden spikes in write traffic in a globally distributed service?",
        time: "1:30",
        feedback: null
      },
      {
        role: "user",
        text: "Um, I would probably use some sort of, like, message queue like Kafka to rate limit or buffer the writes, and then write them asynchronously. Also maybe leverage edge caching for static components.",
        time: "2:10",
        feedback: {
          type: "warning",
          text: "Avoid filler words ('Um', 'like'). The proposal to use Kafka as a buffer is strong."
        }
      }
    ]
  },
  {
    id: "2",
    title: "Product Designer Mock",
    company: "Google",
    date: "May 12, 2026",
    score: 76,
    duration: "15 mins",
    personaName: "Sarah Lin",
    status: "Needs Work",
    overallFeedback: "Great design intuition but needs clearer articulation of tradeoffs. Speaking pace was slightly too fast.",
    categories: {
      technical: 74,
      communication: 80,
      behavioral: 74
    },
    transcript: [
      {
        role: "interviewer",
        text: "How do you handle negative feedback from product managers during a design review?",
        time: "0:15",
        feedback: null
      },
      {
        role: "user",
        text: "I try to keep an open mind and understand where they are coming from. I separate my personal ego from the work and focus on user metrics.",
        time: "0:50",
        feedback: {
          type: "good",
          text: "Highly professional attitude. Consider giving a concrete past example next time."
        }
      }
    ]
  }
];

export const mockProjectIntel = [
  {
    id: 1,
    name: "Distributed Event Bus (Java / Kafka)",
    description: "Designed and implemented a custom event broker capable of handling 50k write requests per second with high availability.",
    status: "Audited",
    score: 92,
    highlights: [
      "Well-articulated architecture and partition scheme",
      "Explicit handling of partition failures"
    ],
    weaknesses: [
      "Lacks discussion of exactly-once delivery guarantees"
    ],
    questions: [
      "How did you prevent message duplication on retry?",
      "What partition strategy was used to balance consumer load?"
    ]
  },
  {
    id: 2,
    name: "E-Commerce Recommendation System (Python / Redis)",
    description: "Real-time collaborative filtering system using Redis cache and vector similarities to recommend products.",
    status: "Draft",
    score: 74,
    highlights: [
      "Good explanation of Redis caching layers"
    ],
    weaknesses: [
      "Cold start problem for new users is ignored",
      "No monitoring metrics defined"
    ],
    questions: [
      "How did you address the collaborative filtering cold start problem?",
      "How was database fallback configured if Redis nodes went down?"
    ]
  }
];
