import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid, Check, AlertCircle } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import ComingSoon from './ComingSoon';

export default function Quiz({ 
  mcqs, 
  answers, 
  subjectName, 
  categoryName, 
  initialAnswers = {}, 
  initialIdx = 0, 
  onSaveDraft, 
  onSubmitTest, 
  onCancelQuiz 
}) {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const [userAnswers, setUserAnswers] = useState(initialAnswers);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [showQuestionMap, setShowQuestionMap] = useState(true);
  const [jumpInput, setJumpInput] = useState('');
  const [showSaveFeedback, setShowSaveFeedback] = useState(false);

  // Store refs to keep values updated inside event listeners/unload handlers
  const saveStateRef = useRef({ currentIdx, userAnswers });
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    saveStateRef.current = { currentIdx, userAnswers };
  }, [currentIdx, userAnswers]);

  // Debounced auto-save hook
  useEffect(() => {
    if (isSubmittingRef.current) return;
    const delayDebounceFn = setTimeout(() => {
      if (onSaveDraft) {
        onSaveDraft(saveStateRef.current.currentIdx, saveStateRef.current.userAnswers);
      }
    }, 750);

    return () => clearTimeout(delayDebounceFn);
  }, [currentIdx, userAnswers, onSaveDraft]);

  // Save when the page is unloaded, refreshed, or tab closed (immediate save)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isSubmittingRef.current && onSaveDraft) {
        onSaveDraft(saveStateRef.current.currentIdx, saveStateRef.current.userAnswers);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save immediately on unmount (e.g. when user exits to homepage)
      if (!isSubmittingRef.current) {
        handleBeforeUnload();
      }
    };
  }, [onSaveDraft]);

  const handleManualSave = () => {
    if (onSaveDraft) {
      onSaveDraft(currentIdx, userAnswers);
      setShowSaveFeedback(true);
      setTimeout(() => setShowSaveFeedback(false), 2000);
    }
  };

  if (!mcqs || mcqs.length === 0) {
    return (
      <div className="container-lambo" style={{ padding: '48px 24px' }}>
        <ComingSoon
          onGoBack={onCancelQuiz}
          subjectName={subjectName}
          categoryName={categoryName}
        />
      </div>
    );
  }

  const currentQuestion = mcqs[currentIdx];
  const correctAnswer = answers[currentQuestion.id];
  const totalQuestions = mcqs.length;

  // Stats calculation
  const answeredCount = Object.keys(userAnswers).length;
  const remainingCount = totalQuestions - answeredCount;
  const completionPercentage = (answeredCount / totalQuestions) * 100;

  const handleSelectOption = (optionKey) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionKey
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
      setRevealAnswer(false); // Reset reveal state for next question
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      setRevealAnswer(false); // Reset reveal state
    }
  };

  const handleJump = (e) => {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= totalQuestions) {
      setCurrentIdx(num - 1);
      setRevealAnswer(false);
      setJumpInput('');
    }
  };

  const handleJumpToIdx = (idx) => {
    setCurrentIdx(idx);
    setRevealAnswer(false);
  };

  const handleSubmit = () => {
    isSubmittingRef.current = true;
    onSubmitTest(userAnswers);
  };

  return (
    <div className="container-lambo">
      <div className="quiz-grid-layout">
        
        {/* Main Quiz Area */}
        <div className="quiz-main-card">
          
          {/* Progress Bar (Thin gold line at top of question card) */}
          <div className="quiz-progress-track">
            <motion.div
              className="quiz-progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div>
            {/* Header / Stats row */}
            <div className="quiz-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="quiz-q-index">
                  QUESTION {currentQuestion.id} OF {totalQuestions}
                </span>
                {userAnswers[currentQuestion.id] && (
                  <span className="quiz-status-badge">
                    ANSWERED
                  </span>
                )}
              </div>

              {/* Stats badges */}
              <div className="quiz-stats-summary">
                <span>
                  ANSWERED: <strong>{answeredCount}</strong>
                </span>
                <span>
                  REMAINING: <strong>{remainingCount}</strong>
                </span>
              </div>
            </div>

            {/* Question Statement */}
            <h2 className="quiz-question-text">
              {currentQuestion.question}
            </h2>

            {/* Options List */}
            <div className="options-column">
              {Object.entries(currentQuestion.options).map(([key, val]) => {
                if (!val) return null;
                const isSelected = userAnswers[currentQuestion.id] === key;
                const isCorrect = key === correctAnswer;
                
                // Color coding class strings
                let optionClass = "option-btn";
                if (isSelected) optionClass += " selected";
                if (revealAnswer) {
                  if (isCorrect) {
                    optionClass += " reveal-correct";
                  } else if (isSelected) {
                    optionClass += " reveal-incorrect";
                  } else {
                    optionClass += " disabled";
                  }
                }

                return (
                  <button
                    key={key}
                    onClick={() => !revealAnswer && handleSelectOption(key)}
                    disabled={revealAnswer}
                    className={optionClass}
                  >
                    <span className="option-letter">
                      {key}
                    </span>
                    <span className="option-text">{val}</span>

                    {/* Indicators during reveal state */}
                    {revealAnswer && (
                      <div className="option-icon-indicator">
                        {isCorrect && <Check size={16} />}
                        {!isCorrect && isSelected && <AlertCircle size={16} />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls Footer */}
          <div className="quiz-action-bar">
            {/* Reveal Answer Mode */}
            <div className="quiz-toolbar-row">
              <div 
                onClick={() => setRevealAnswer(!revealAnswer)}
                className="lambo-switch-container"
                title="Toggle reveal mode to show the correct answer"
              >
                <span className="quiz-toggle-label">
                  REVEAL CORRECT ANSWER
                </span>
                <div className={`lambo-switch ${revealAnswer ? 'active' : ''}`}>
                  <div className="lambo-switch-thumb" />
                </div>
              </div>

              <form onSubmit={handleJump} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  max={totalQuestions}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  placeholder="JUMP TO Q#"
                  className="lambo-input"
                  style={{ textAlign: 'center', height: '40px', width: '100px', fontSize: '12px' }}
                />
                <button type="submit" className="btn-ghost" style={{ height: '40px', padding: '0 16px' }}>
                  GO
                </button>
              </form>
            </div>

            {/* Navigation buttons */}
            <div className="quiz-nav-row">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="btn-ghost"
                style={{ gap: '6px' }}
              >
                <ChevronLeft size={14} />
                PREV
              </button>

              <button
                onClick={handleManualSave}
                className="btn-ghost"
                style={{ gap: '6px' }}
                title="Save current progress into drafts manually"
              >
                {showSaveFeedback ? (
                  <>
                    <Check size={14} className="text-lambo-cyan" />
                    SAVED!
                  </>
                ) : (
                  "SAVE DRAFT"
                )}
              </button>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="btn-outline-gold"
              >
                SUBMIT TEST
              </button>

              <button
                onClick={handleNext}
                disabled={currentIdx === totalQuestions - 1}
                className="btn-accent"
                style={{ gap: '6px' }}
              >
                NEXT
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Question Navigation Grid */}
        <div className="quiz-sidebar">
          <div className="sidebar-title-row">
            <h3 className="sidebar-title">
              <Grid size={15} className="text-lambo-gold" />
              QUESTION BANK MAP
            </h3>
            <button
              onClick={() => setShowQuestionMap(!showQuestionMap)}
              className="sidebar-title-toggle lg:hidden"
            >
              {showQuestionMap ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          {showQuestionMap && (
            <div className="grid-map-scroll-area">
              <div className="grid-map">
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                  const qNum = idx + 1;
                  const isCurrent = idx === currentIdx;
                  const isAnswered = !!userAnswers[qNum];
                  
                  let btnClass = "grid-map-btn";
                  if (isAnswered) btnClass += " answered";
                  if (isCurrent) btnClass += " active";

                  return (
                    <button
                      key={idx}
                      onClick={() => handleJumpToIdx(idx)}
                      className={btnClass}
                    >
                      {qNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="sidebar-legend">
            <div className="legend-item">
              <span className="legend-color-box" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-black)' }} />
              <span>ACTIVE QUESTION</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box" style={{ borderColor: 'rgba(41, 171, 226, 0.3)', backgroundColor: 'rgba(41, 171, 226, 0.05)' }} />
              <span>ANSWERED</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box" style={{ borderColor: 'var(--color-charcoal)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
              <span>UNANSWERED</span>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleSubmit}
        title="SUBMIT TEST PREPARATION?"
        message={`You have answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to finish and view your results?`}
        confirmText="SUBMIT TEST"
        cancelText="KEEP EDITING"
      />
    </div>
  );
}
