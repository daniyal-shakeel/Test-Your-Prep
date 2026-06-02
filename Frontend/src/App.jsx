import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import Results from './components/Results';
import QuestionBank from './components/QuestionBank';
import History from './components/History';
import ConfirmModal from './components/ConfirmModal';
import TopWarningBanner from './components/TopWarningBanner';
import DisclaimerModal from './components/DisclaimerModal';
import AuthorFooter from './components/AuthorFooter';
import { mcqs } from './assets/mcqs';
import { answers } from './assets/answers';
import { subjects } from './assets/subjects';

const HISTORY_KEY = 'mcq_app_history_v1';
const DRAFTS_KEY = 'mcq_app_drafts_v1';
const LEGACY_HISTORY_KEY = 'mad_quiz_prep_history';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'quiz', 'results', 'bank'
  const [historyLog, setHistoryLog] = useState(() => {
    try {
      const legacyStored = localStorage.getItem(LEGACY_HISTORY_KEY);
      if (legacyStored) {
        localStorage.setItem(HISTORY_KEY, legacyStored);
        localStorage.removeItem(LEGACY_HISTORY_KEY);
        return JSON.parse(legacyStored);
      }
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
      return [];
    }
  });
  const [drafts, setDrafts] = useState(() => {
    try {
      const storedDrafts = localStorage.getItem(DRAFTS_KEY);
      return storedDrafts ? JSON.parse(storedDrafts) : [];
    } catch (e) {
      console.error("Failed to load drafts from localStorage:", e);
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState('history'); // 'history', 'drafts'
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);
  const [currentAttemptAnswers, setCurrentAttemptAnswers] = useState({});
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(() => {
    try {
      const accepted = localStorage.getItem('disclaimer_accepted');
      return !accepted;
    } catch {
      return true;
    }
  });

  // Seeding parameters for starting or resuming quiz
  const [initialAnswers, setInitialAnswers] = useState({});
  const [initialIdx, setInitialIdx] = useState(0);

  // Draft deletion confirmation state
  const [deleteConfirmDraft, setDeleteConfirmDraft] = useState(null);

  // Dynamic Subject & Category state
  const [selectedSubjectId, setSelectedSubjectId] = useState('mobile-app-development');
  const [selectedCategoryId, setSelectedCategoryId] = useState('mids');

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const activeCategory = activeSubject.categories.find(c => c.id === selectedCategoryId) || activeSubject.categories[0];

  // Save attempt and update log based on dynamically selected subject/category pool
  const handleFinishedQuiz = (userAnswers) => {
    const currentMCQs = mcqs[selectedSubjectId]?.[selectedCategoryId] || [];
    const currentAnswers = answers[selectedSubjectId]?.[selectedCategoryId] || {};

    let score = 0;
    const correct = [];
    const incorrect = [];

    currentMCQs.forEach(q => {
      const isCorrect = userAnswers[q.id] === currentAnswers[q.id];
      if (isCorrect) {
        score++;
        correct.push(q.id);
      } else {
        incorrect.push(q.id);
      }
    });

    const percentage = currentMCQs.length > 0 ? (score / currentMCQs.length) * 100 : 0;
    const newAttempt = {
      id: `attempt_${Date.now()}`,
      date: new Date().toISOString(),
      score,
      percentage,
      correctAnswersCount: score,
      incorrectAnswersCount: currentMCQs.length - score,
      correctAnswersList: correct,
      incorrectAnswersList: incorrect,
      userAnswers,
      subjectId: selectedSubjectId,
      categoryId: selectedCategoryId,
      subjectName: activeSubject.name,
      categoryName: activeCategory.name,
      totalQuestions: currentMCQs.length
    };

    const updatedLog = [newAttempt, ...historyLog];
    setHistoryLog(updatedLog);
    
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedLog));
    } catch (e) {
      console.error("Failed to write history to localStorage:", e);
    }

    // Delete any active draft matching this subject-category combination
    const targetDraftId = `${selectedSubjectId}_${selectedCategoryId}`;
    const updatedDrafts = drafts.filter(d => d.draftId !== targetDraftId);
    setDrafts(updatedDrafts);
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
    } catch (e) {
      console.error(e);
    }

    setCurrentAttemptAnswers(userAnswers);
    setActivePage('results');
  };

  const handleClearHistory = () => {
    setHistoryLog([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error("Failed to remove history from localStorage:", e);
    }
  };

  // Draft operations
  const handleSaveDraft = (subjectId, categoryId, currentIdx, userAnswers) => {
    // Only proceed if user is active in quiz page. Otherwise, do not write blank drafts.
    const currentMCQs = mcqs[subjectId]?.[categoryId] || [];
    if (currentMCQs.length === 0) return;

    const sub = subjects.find(s => s.id === subjectId) || { name: 'Subject' };
    const cat = sub.categories?.find(c => c.id === categoryId) || { name: 'Category' };
    const totalQuestions = currentMCQs.length;
    const answeredCount = Object.values(userAnswers).filter(val => !!val).length;

    const targetDraftId = `${subjectId}_${categoryId}`;
    
    setDrafts(prevDrafts => {
      const existingIdx = prevDrafts.findIndex(d => d.draftId === targetDraftId);
      const newDraftObj = {
        draftId: targetDraftId,
        subjectId,
        categoryId,
        subjectName: sub.name,
        categoryName: cat.name,
        userAnswers,
        currentIdx,
        currentQuestionNumber: currentIdx + 1,
        answeredCount,
        totalQuestions,
        percentageCompleted: totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0,
        updatedAt: new Date().toISOString(),
        startedAt: prevDrafts[existingIdx]?.startedAt || new Date().toISOString(),
        remainingTime: null,
        timeSpent: null
      };

      const updated = existingIdx > -1
        ? prevDrafts.map((d, i) => i === existingIdx ? newDraftObj : d)
        : [newDraftObj, ...prevDrafts];

      try {
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save drafts to localStorage:", e);
      }
      return updated;
    });
  };

  const handleResumeDraft = (draft) => {
    setSelectedSubjectId(draft.subjectId);
    setSelectedCategoryId(draft.categoryId);
    setInitialAnswers(draft.userAnswers);
    setInitialIdx(draft.currentIdx);
    setActivePage('quiz');
  };

  const confirmDeleteDraft = () => {
    if (!deleteConfirmDraft) return;
    const targetDraftId = deleteConfirmDraft.draftId;
    const updatedDrafts = drafts.filter(d => d.draftId !== targetDraftId);
    setDrafts(updatedDrafts);
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
    } catch (e) {
      console.error("Failed to delete draft:", e);
    }
    setDeleteConfirmDraft(null);
  };

  const handleStartNewFromDraft = (draft) => {
    const updatedDrafts = drafts.filter(d => d.draftId !== draft.draftId);
    setDrafts(updatedDrafts);
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
    } catch (e) {
      console.error(e);
    }

    setSelectedSubjectId(draft.subjectId);
    setSelectedCategoryId(draft.categoryId);
    setInitialAnswers({});
    setInitialIdx(0);
    setActivePage('quiz');
  };

  const startNewQuiz = () => {
    setInitialAnswers({});
    setInitialIdx(0);
    setCurrentAttemptAnswers({});
    setActivePage('quiz');
  };

  const handleAcceptDisclaimer = () => {
    try {
      localStorage.setItem('disclaimer_accepted', 'true');
    } catch (e) {
      console.error(e);
    }
    setShowDisclaimerModal(false);
  };

  // Page slider animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="app-wrapper">
      <TopWarningBanner />
      
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        toggleHistory={(tab) => {
          setActiveDrawerTab(tab || 'history');
          setIsHistoryOpen(true);
        }}
      />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {activePage === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Hero
                subjects={subjects}
                selectedSubjectId={selectedSubjectId}
                setSelectedSubjectId={setSelectedSubjectId}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                mcqs={mcqs}
                onStartQuiz={startNewQuiz}
                onOpenBank={() => setActivePage('bank')}
                historyLog={historyLog}
                drafts={drafts}
                onResumeDraft={handleResumeDraft}
                onStartNewFromDraft={handleStartNewFromDraft}
              />
            </motion.div>
          )}

          {activePage === 'quiz' && (
            <motion.div
              key="quiz"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Quiz
                mcqs={mcqs[selectedSubjectId][selectedCategoryId]}
                answers={answers[selectedSubjectId][selectedCategoryId]}
                subjectName={activeSubject.name}
                categoryName={activeCategory.name}
                initialAnswers={initialAnswers}
                initialIdx={initialIdx}
                onSaveDraft={(idx, ans) => handleSaveDraft(selectedSubjectId, selectedCategoryId, idx, ans)}
                onSubmitTest={handleFinishedQuiz}
                onCancelQuiz={() => setActivePage('home')}
              />
            </motion.div>
          )}

          {activePage === 'results' && (
            <motion.div
              key="results"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Results
                mcqs={mcqs[selectedSubjectId][selectedCategoryId]}
                answers={answers[selectedSubjectId][selectedCategoryId]}
                userAnswers={currentAttemptAnswers}
                onRetake={startNewQuiz}
                onGoHome={() => setActivePage('home')}
              />
            </motion.div>
          )}

          {activePage === 'bank' && (
            <motion.div
              key="bank"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <QuestionBank
                subjects={subjects}
                selectedSubjectId={selectedSubjectId}
                setSelectedSubjectId={setSelectedSubjectId}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                mcqs={mcqs}
                answers={answers}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AuthorFooter />

      {/* History & Drafts Drawer */}
      <History
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyLog={historyLog}
        onClearHistory={() => setIsClearHistoryModalOpen(true)}
        drafts={drafts}
        onResumeDraft={handleResumeDraft}
        onDeleteDraft={setDeleteConfirmDraft}
        onStartNewFromDraft={handleStartNewFromDraft}
        activeTab={activeDrawerTab}
        setActiveTab={setActiveDrawerTab}
      />

      {/* Clear History Confirmation */}
      <ConfirmModal
        isOpen={isClearHistoryModalOpen}
        onClose={() => setIsClearHistoryModalOpen(false)}
        onConfirm={handleClearHistory}
        title="CLEAR ATTEMPT HISTORY?"
        message="This action will permanently delete all your saved test marks and history records from local storage. This cannot be undone."
        confirmText="CLEAR LOGS"
        cancelText="KEEP RECORDS"
      />

      {/* Draft Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirmDraft}
        onClose={() => setDeleteConfirmDraft(null)}
        onConfirm={confirmDeleteDraft}
        title="DELETE DRAFT PROGRESS?"
        message="Are you sure you want to delete this draft? This progress cannot be recovered."
        confirmText="DELETE DRAFT"
        cancelText="KEEP DRAFT"
      />

      {/* Mandatory Disclaimer Countdown Modal */}
      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onAccept={handleAcceptDisclaimer}
      />
    </div>
  );
}
