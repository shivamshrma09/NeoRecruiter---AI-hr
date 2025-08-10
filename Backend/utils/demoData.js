
const demoHrUser = {
  _id: 'demo123',
  companyName: 'NeoRecruiter Demo',
  email: 'interview123@gmail.com',
  profilePicture: 'default-profile.png',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/neorecruiter',
    twitter: 'https://twitter.com/neorecruiter',
  },
  interviews: [
    {
      _id: 'interview1',
      role: 'Frontend Developer',
      technicalDomain: 'React',
      questions: [
        {
          text: 'Explain the concept of Virtual DOM in React.',
          expectedAnswer: 'Virtual DOM is a lightweight copy of the actual DOM. React uses it to improve performance by minimizing direct DOM manipulation. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (diffing), and updates only the changed parts in the real DOM.'
        },
        {
          text: 'What are React Hooks and how do they work?',
          expectedAnswer: 'React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 to allow using state without writing a class. Common hooks include useState for state management, useEffect for side effects, useContext for context API, and useReducer for complex state logic.'
        },
        {
          text: 'Describe the difference between controlled and uncontrolled components.',
          expectedAnswer: 'Controlled components are those where form data is handled by React state. The value of input elements is controlled by React, and changes are handled through event handlers. Uncontrolled components store form data in the DOM itself, and you access the values using refs. Controlled components provide more control and are the recommended approach.'
        }
      ],
      candidates: [
        {
          email: 'candidate1@example.com',
          name: 'John Doe',
          phone: '123-456-7890',
          resume: 'uploads/resume1.pdf',
          interviewLink: 'https://neorecruiter.vercel.app/interview?id=interview1&email=candidate1@example.com',
          answers: [
            'Virtual DOM is a concept where a virtual representation of the UI is kept in memory and synced with the real DOM by a library such as ReactDOM. This process is called reconciliation.',
            'React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 as a way to use state and other React features without writing a class.',
            'Controlled components are those where form data is handled by React state, while uncontrolled components store form data in the DOM itself.'
          ],
          scores: [
            {
              Relevance: '4 - Answer directly addresses the core question with good focus on key concepts',
              ContentDepth: '4 - Comprehensive understanding with detailed technical explanations',
              CommunicationSkill: '3 - Clear communication with logical flow and understandable explanations',
              Sentiment: '4 - Confident and professional tone, shows enthusiasm for the topic',
              skillcorrect: '4 - Good technical expertise demonstrated with practical knowledge application',
              overallscore: '4 - Above average performance showing strong technical competency and communication',
              improvement: 'Consider providing more specific examples of how Virtual DOM improves performance in real-world applications.'
            },
            {
              Relevance: '5 - Perfectly relevant answer comprehensively addressing all aspects of the question',
              ContentDepth: '4 - Comprehensive understanding with detailed technical explanations',
              CommunicationSkill: '4 - Articulate and well-structured response with clear professional communication',
              Sentiment: '4 - Confident and professional tone, shows enthusiasm for the topic',
              skillcorrect: '4 - Good technical expertise demonstrated with practical knowledge application',
              overallscore: '4 - Above average performance showing strong technical competency and communication',
              improvement: 'You could enhance your answer by mentioning specific hooks like useCallback or useMemo and their use cases.'
            },
            {
              Relevance: '3 - Moderately relevant answer covering main points but could be more focused',
              ContentDepth: '3 - Good understanding demonstrated with reasonable technical content',
              CommunicationSkill: '3 - Clear communication with logical flow and understandable explanations',
              Sentiment: '3 - Shows positive engagement and professional attitude in response',
              skillcorrect: '3 - Basic competency shown with fundamental concepts understood correctly',
              overallscore: '3 - Average performance meeting basic requirements with solid foundation',
              improvement: 'Your answer could be improved by providing examples of when to use each type of component and discussing the benefits and drawbacks in more detail.'
            }
          ],
          status: 'completed',
          cheatingDetected: false,
          completedAt: new Date('2023-06-15T14:30:00')
        },
        {
          email: 'candidate2@example.com',
          name: 'Jane Smith',
          phone: '987-654-3210',
          resume: 'uploads/resume2.pdf',
          interviewLink: 'https://neorecruiter.vercel.app/interview?id=interview1&email=candidate2@example.com',
          answers: [
            'Virtual DOM is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM by a library such as ReactDOM.',
            'React Hooks are functions that let you use state and other React features without writing a class component.',
            ''
          ],
          scores: [
            {
              Relevance: '4 - Answer directly addresses the core question with good focus on key concepts',
              ContentDepth: '3 - Good understanding demonstrated with reasonable technical content',
              CommunicationSkill: '3 - Clear communication with logical flow and understandable explanations',
              Sentiment: '3 - Shows positive engagement and professional attitude in response',
              skillcorrect: '3 - Basic competency shown with fundamental concepts understood correctly',
              overallscore: '3 - Average performance meeting basic requirements with solid foundation',
              improvement: 'Consider explaining the reconciliation process and how it improves performance in more detail.'
            },
            {
              Relevance: '3 - Moderately relevant answer covering main points but could be more focused',
              ContentDepth: '2 - Basic level understanding with limited technical details',
              CommunicationSkill: '3 - Clear communication with logical flow and understandable explanations',
              Sentiment: '3 - Shows positive engagement and professional attitude in response',
              skillcorrect: '2 - Limited technical understanding with gaps in fundamental concepts',
              overallscore: '2 - Below average performance with room for improvement in technical depth',
              improvement: 'Your answer is very brief. Consider explaining how hooks work, mentioning common hooks like useState and useEffect, and providing examples of their usage.'
            }
          ],
          status: 'pending',
          cheatingDetected: true,
          cheatingFlags: ['tab-switch-or-minimize', 'copy-detected']
        }
      ],
      createdAt: new Date('2023-06-10T09:00:00')
    },
    {
      _id: 'interview2',
      role: 'Backend Developer',
      technicalDomain: 'Node.js',
      questions: [
        {
          text: 'Explain the event loop in Node.js.',
          expectedAnswer: 'The event loop is a mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It works by offloading operations to the system kernel whenever possible and using a callback queue to handle the results. The event loop continuously checks if the call stack is empty, and if so, it takes the first event from the queue and pushes it to the call stack, which runs it.'
        },
        {
          text: 'What is middleware in Express.js?',
          expectedAnswer: "Middleware functions in Express.js are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle. These functions can execute any code, make changes to the request and response objects, end the request-response cycle, and call the next middleware function. They are used for tasks like authentication, logging, parsing request bodies, handling errors, etc."
        }
      ],
      candidates: [
        {
          email: 'candidate3@example.com',
          name: 'Alex Johnson',
          phone: '555-123-4567',
          resume: 'uploads/resume3.pdf',
          interviewLink: 'https://neorecruiter.vercel.app/interview?id=interview2&email=candidate3@example.com',
          answers: [
            'The event loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It works by offloading operations to the system kernel whenever possible.',
            "Middleware functions are functions that have access to the request object, the response object, and the next middleware function in the application's request-response cycle. They can perform tasks like authentication, logging, etc."
          ],
          scores: [
            {
              Relevance: '4 - Answer directly addresses the core question with good focus on key concepts',
              ContentDepth: '3 - Good understanding demonstrated with reasonable technical content',
              CommunicationSkill: '3 - Clear communication with logical flow and understandable explanations',
              Sentiment: '3 - Shows positive engagement and professional attitude in response',
              skillcorrect: '3 - Basic competency shown with fundamental concepts understood correctly',
              overallscore: '3 - Average performance meeting basic requirements with solid foundation',
              improvement: 'Consider explaining the callback queue and how the event loop processes it in more detail.'
            },
            {
              Relevance: '4 - Answer directly addresses the core question with good focus on key concepts',
              ContentDepth: '3 - Good understanding demonstrated with reasonable technical content',
              CommunicationSkill: '3 - Clear communication with logical flow and understandable explanations',
              Sentiment: '3 - Shows positive engagement and professional attitude in response',
              skillcorrect: '3 - Basic competency shown with fundamental concepts understood correctly',
              overallscore: '3 - Average performance meeting basic requirements with solid foundation',
              improvement: 'Your answer could be improved by providing an example of middleware implementation and explaining the next function in more detail.'
            }
          ],
          status: 'completed',
          cheatingDetected: false,
          completedAt: new Date('2023-06-20T11:15:00')
        }
      ],
      createdAt: new Date('2023-06-18T10:30:00')
    }
  ],
  interviewCount: 2,
  interviewCountCandidate: 3,
  createdAt: new Date('2023-06-01T08:00:00'),
  Balance: 850
};
module.exports = {
  demoHrUser
};
