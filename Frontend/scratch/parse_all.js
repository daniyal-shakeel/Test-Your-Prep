import fs from 'fs';
import path from 'path';

const workspaceDir = 'C:\\MEGA-NEW\\University\\smester 7\\Mid\\Android Development MCQs prep';
const madMdPath = path.join(workspaceDir, 'public', 'MAD Quiz Bank.md');
const pdcMdPath = path.join(workspaceDir, 'public', 'parallel-distibution.md');

const mcqsJsPath = path.join(workspaceDir, 'src', 'assets', 'mcqs.js');
const answersJsPath = path.join(workspaceDir, 'src', 'assets', 'answers.js');
const subjectsJsPath = path.join(workspaceDir, 'src', 'assets', 'subjects.js');

// Verified answer list for MAD Mids (120 items)
const madMidsAnswers = [
  "B", "C", "C", "B", "C", "B", "A", "A", "B", "C", "C", "A", "B", "A", "A", "A", "B", "C", "C", "C",
  "C", "B", "C", "C", "B", "B", "C", "B", "C", "B", "C", "C", "B", "A", "B", "C", "B", "B", "C", "B",
  "B", "B", "B", "A", "B", "B", "B", "A", "C", "B", "C", "B", "B", "A", "A", "B", "A", "A", "B", "A",
  "C", "A", "A", "B", "B", "B", "B", "A", "C", "A", "B", "B", "A", "B", "C", "A", "B", "A", "C", "B",
  "C", "B", "A", "A", "B", "B", "B", "A", "B", "C", "B", "B", "B", "B", "A", "B", "C", "B", "C", "D",
  "B", "C", "B", "C", "B", "B", "C", "B", "B", "B", "C", "B", "B", "A", "C", "B", "A", "B", "B", "C"
];

function cleanText(text) {
  return text.replace(/\\$/, '').trim();
}

function parseMAD() {
  const content = fs.readFileSync(madMdPath, 'utf-8');
  const lines = content.split('\n');
  const parsed = [];
  let currentQ = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const qMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
    if (qMatch) {
      if (currentQ) parsed.push(currentQ);
      currentQ = {
        id: parsed.length + 1,
        question: cleanText(qMatch[2]),
        options: {}
      };
      continue;
    }

    const optMatch = line.match(/^([A-Da-d])[\.\)]\s+(.*)/);
    if (optMatch && currentQ) {
      const letter = optMatch[1].toUpperCase();
      currentQ.options[letter] = cleanText(optMatch[2]);
      continue;
    }

    if (currentQ && Object.keys(currentQ.options).length === 0 && !line.startsWith('#')) {
      currentQ.question += ' ' + cleanText(line);
    }
  }
  if (currentQ) parsed.push(currentQ);
  return parsed;
}

function parsePDC() {
  const content = fs.readFileSync(pdcMdPath, 'utf-8');
  const lines = content.split('\n');
  const parsed = [];
  const answersList = {};
  let currentQ = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const qMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
    if (qMatch) {
      if (currentQ) parsed.push(currentQ);
      currentQ = {
        id: parsed.length + 1,
        question: cleanText(qMatch[2]),
        options: {}
      };
      continue;
    }

    // Check if line is the correct option wrapped in ** (e.g. **B) Shared memory...**)
    const isCorrect = line.startsWith('**') && line.endsWith('**');
    const cleanLine = isCorrect ? line.replace(/^\*\*/, '').replace(/\*\*$/, '').trim() : line;

    const optMatch = cleanLine.match(/^([A-Da-d])[\.\)]\s+(.*)/);
    if (optMatch && currentQ) {
      const letter = optMatch[1].toUpperCase();
      currentQ.options[letter] = cleanText(optMatch[2]);
      if (isCorrect) {
        answersList[currentQ.id] = letter;
      }
      continue;
    }

    if (currentQ && Object.keys(currentQ.options).length === 0) {
      currentQ.question += ' ' + cleanText(line);
    }
  }
  if (currentQ) parsed.push(currentQ);
  return { parsed, answersList };
}

// Empty placeholders for Finals
const madFinalsMCQs = [];
const madFinalsAnswers = {};

const pdcFinalsMCQs = [];
const pdcFinalsAnswers = {};


function main() {
  console.log("Parsing MAD MCQs...");
  const madMids = parseMAD();
  console.log(`Parsed ${madMids.length} questions for MAD Mids.`);

  console.log("Parsing PDC MCQs...");
  const { parsed: pdcMids, answersList: pdcMidsAnswers } = parsePDC();
  console.log(`Parsed ${pdcMids.length} questions for PDC Mids.`);

  // Map answers for MAD
  const madMidsAnswersMap = {};
  madMidsAnswers.forEach((ans, idx) => {
    madMidsAnswersMap[idx + 1] = ans;
  });

  // Construct structured data
  const mcqsData = {
    "mobile-app-development": {
      "mids": madMids,
      "finals": madFinalsMCQs
    },
    "parallel-distributed-computing": {
      "mids": pdcMids,
      "finals": pdcFinalsMCQs
    }
  };

  const answersData = {
    "mobile-app-development": {
      "mids": madMidsAnswersMap,
      "finals": madFinalsAnswers
    },
    "parallel-distributed-computing": {
      "mids": pdcMidsAnswers,
      "finals": pdcFinalsAnswers
    }
  };

  const subjectsData = [
    {
      id: "mobile-app-development",
      name: "Mobile Application Development",
      categories: [
        { id: "mids", name: "Mids" },
        { id: "finals", name: "Finals" }
      ]
    },
    {
      id: "parallel-distributed-computing",
      name: "Parallel and Distributed Computing",
      categories: [
        { id: "mids", name: "Mids" },
        { id: "finals", name: "Finals" }
      ]
    }
  ];

  // Write assets files
  fs.writeFileSync(mcqsJsPath, `export const mcqs = ${JSON.stringify(mcqsData, null, 2)};\n`, 'utf-8');
  fs.writeFileSync(answersJsPath, `export const answers = ${JSON.stringify(answersData, null, 2)};\n`, 'utf-8');
  fs.writeFileSync(subjectsJsPath, `export const subjects = ${JSON.stringify(subjectsData, null, 2)};\n`, 'utf-8');

  console.log("Restructured assets written successfully.");
}

main();
