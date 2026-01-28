// src/data.js

export const MAIN_CATEGORIES = [
  { id: 'tech', title: 'Tech', description: 'Test your knowledge in software and hardware.', icon: '💻' },
  { id: 'mathematics', title: 'Mathematics', description: 'Challenge yourself with math problems.', icon: '📐' },
  { id: 'sciences', title: 'Sciences', description: 'Explore physics, chemistry, and nature.', icon: '🔬' },
  { id: 'aptitude', title: 'Aptitude', description: 'Test your reasoning and problem-solving skills.', icon: '💡' },
  { id: 'knowledge', title: 'Knowledge & Affairs', description: 'Quizzes on general facts and global events.', icon: '📰' },
  { id: 'languages', title: 'Languages', description: 'Test your skills in English, Spanish, and more.', icon: '🗣️' },
];

// Sub-subjects structure (Step 3: When clicking a main category, show these)
export const SUB_SUBJECTS = {
  sciences: [
    { id: 'botany', title: 'Botany', description: 'Plant life (6th to Intermediate)', icon: '🌿' },
    { id: 'chemistry', title: 'Chemistry', description: 'Matter and properties (6th to Intermediate)', icon: '🧪' },
    { id: 'physics', title: 'Physics', description: 'Force, Energy, and Motion (6th to Intermediate)', icon: '🔭' },
    { id: 'zoology', title: 'Zoology', description: 'Animal life (6th to Intermediate)', icon: '🐾' },
  ],
  mathematics: [
    { id: 'algebra', title: 'Algebra', description: 'Variables and equations (6th to Intermediate)' },
    { id: 'geometry', title: 'Geometry', description: 'Shapes and space (6th to Intermediate)' },
    { id: 'calculus', title: 'Calculus', description: 'Rates of change (Intermediate level)' },
  ],
  tech: [
    { id: 'web-dev', title: 'Web Development', description: 'HTML, CSS, JS basics.' },
    { id: 'data-struc', title: 'Data Structures', description: 'Arrays, Lists, Trees.' },
  ],
  // ... continue for aptitude, knowledge, and languages
};

// Quizzes (Step 4: Filtered by sub-subject ID)
export const QUIZZES = [
  { id: 'q1', subSubjectId: 'chemistry', title: 'Atomic Structure (6th-8th Grade)', status: 'Published', questions: 10, time: 15, completions: 50 },
  { id: 'q2', subSubjectId: 'chemistry', title: 'Electrochemistry (Intermediate Level)', status: 'Draft', questions: 20, time: 30, completions: 10 },
  { id: 'q3', subSubjectId: 'botany', title: 'Plant Cells and Tissues (6th-8th Grade)', status: 'Published', questions: 15, time: 20, completions: 32 },
  { id: 'q4', subSubjectId: 'algebra', title: 'Basic Linear Equations (6th-8th Grade)', status: 'Published', questions: 12, time: 15, completions: 45 },
];