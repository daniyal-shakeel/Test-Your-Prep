import fs from 'fs';
import path from 'path';

// Define paths
const workspaceDir = 'C:\\MEGA-NEW\\University\\smester 7\\Mid\\Android Development MCQs prep';
const mdPath = path.join(workspaceDir, 'public', 'MAD Quiz Bank.md');
const mcqsJsPath = path.join(workspaceDir, 'src', 'assets', 'mcqs.js');
const answersJsPath = path.join(workspaceDir, 'src', 'assets', 'answers.js');

// Pre-verified correct answers for all 120 questions
const correctAnswers = [
  // 1-20
  "B", "C", "C", "B", "C", "B", "A", "A", "B", "C", "C", "A", "B", "A", "A", "A", "B", "C", "C", "C",
  // 21-40
  "C", "B", "C", "C", "B", "B", "C", "B", "C", "B", "C", "C", "B", "A", "B", "C", "B", "B", "C", "B",
  // 41-60
  "B", "B", "B", "A", "B", "B", "B", "A", "C", "B", "C", "B", "B", "A", "A", "B", "A", "A", "B", "A",
  // 61-80
  "C", "A", "A", "B", "B", "B", "B", "A", "C", "A", "B", "B", "A", "B", "C", "A", "B", "A", "C", "B",
  // 81-100
  "C", "B", "A", "A", "B", "B", "B", "A", "B", "C", "B", "B", "B", "B", "A", "B", "C", "B", "C", "D",
  // 101-120
  "B", "C", "B", "C", "B", "B", "C", "B", "B", "B", "C", "B", "B", "A", "C", "B", "A", "B", "B", "C"
];

function cleanText(text) {
  return text.replace(/\\$/, '').trim();
}

function parseMCQs() {
  const content = fs.readFileSync(mdPath, 'utf-8');
  const lines = content.split('\n');
  
  const parsedQuestions = [];
  let currentQ = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if line starts a question (e.g. "1.  Android..." or "1)  Which...")
    const qMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
    if (qMatch) {
      if (currentQ) {
        parsedQuestions.push(currentQ);
      }
      currentQ = {
        originalNum: parseInt(qMatch[1], 10),
        question: cleanText(qMatch[2]),
        options: {}
      };
      continue;
    }
    
    // Check if line is an option (e.g. "A. Windows..." or "a) activity...")
    const optMatch = line.match(/^([A-Da-d])[\.\)]\s+(.*)/);
    if (optMatch && currentQ) {
      const optLetter = optMatch[1].toUpperCase();
      currentQ.options[optLetter] = cleanText(optMatch[2]);
      continue;
    }
    
    // If we have a current question and it's not an option or a new question,
    // it's likely a continuation of the question statement
    if (currentQ && Object.keys(currentQ.options).length === 0) {
      currentQ.question += ' ' + cleanText(line);
    }
  }
  
  if (currentQ) {
    parsedQuestions.push(currentQ);
  }
  
  console.log(`Parsed ${parsedQuestions.length} questions.`);
  
  // Verify counts
  if (parsedQuestions.length !== 120) {
    console.error('Error: Expected 120 questions, but parsed ' + parsedQuestions.length);
    process.exit(1);
  }
  
  // Map and renumber
  const formattedMCQs = parsedQuestions.map((q, index) => {
    const id = index + 1;
    return {
      id: id,
      question: q.question,
      options: {
        A: q.options.A || '',
        B: q.options.B || '',
        C: q.options.C || '',
        D: q.options.D || ''
      }
    };
  });
  
  // Create Assets files
  const mcqsJsContent = `// Exported Android Development MCQs\nexport const mcqs = ${JSON.stringify(formattedMCQs, null, 2)};\n`;
  const answersJsContent = `// Exported correct answers mapped by Question ID\nexport const answers = ${JSON.stringify(
    correctAnswers.reduce((acc, ans, idx) => {
      acc[idx + 1] = ans;
      return acc;
    }, {}),
    null,
    2
  )};\n`;
  
  // Make sure assets folder exists
  const assetsDir = path.dirname(mcqsJsPath);
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  fs.writeFileSync(mcqsJsPath, mcqsJsContent, 'utf-8');
  fs.writeFileSync(answersJsPath, answersJsContent, 'utf-8');
  console.log('Successfully wrote assets files.');
  
  // Generate corrected markdown file
  let newMdContent = '# Android Development with Kotlin - Quiz Prep (1-120)\n\n';
  
  formattedMCQs.forEach(q => {
    newMdContent += `${q.id}. ${q.question}\n`;
    newMdContent += `   A. ${q.options.A}\n`;
    newMdContent += `   B. ${q.options.B}\n`;
    newMdContent += `   C. ${q.options.C}\n`;
    newMdContent += `   D. ${q.options.D}\n\n`;
  });
  
  fs.writeFileSync(mdPath, newMdContent, 'utf-8');
  console.log('Successfully updated markdown file with corrected numbering.');
}

parseMCQs();
