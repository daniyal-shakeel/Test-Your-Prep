import { motion } from 'framer-motion';
import { Play, BookOpen, Award, CheckCircle2, Book, Calendar, Edit } from 'lucide-react';

export default function Hero({
  subjects,
  selectedSubjectId,
  setSelectedSubjectId,
  selectedCategoryId,
  setSelectedCategoryId,
  mcqs,
  onStartQuiz,
  onOpenBank,
  historyLog,
  drafts = [],
  onResumeDraft,
  onStartNewFromDraft
}) {
  const activeSubject = subjects.find(s => s.id === selectedSubjectId);
  const activeCategory = activeSubject?.categories.find(c => c.id === selectedCategoryId);
  const currentMCQsList = mcqs[selectedSubjectId]?.[selectedCategoryId] || [];
  const totalMCQsCount = currentMCQsList.length;

  const activeDraft = drafts.find(d => d.subjectId === selectedSubjectId && d.categoryId === selectedCategoryId);

  // Filter history log specifically for the selected subject and category
  const filteredHistory = historyLog.filter(h => {
    const isMAD = selectedSubjectId === 'mobile-app-development';
    const isMids = selectedCategoryId === 'mids';
    const matchSub = h.subjectId ? h.subjectId === selectedSubjectId : isMAD;
    const matchCat = h.categoryId ? h.categoryId === selectedCategoryId : isMids;
    return matchSub && matchCat;
  });

  const totalAttempts = filteredHistory.length;
  const bestScore = totalAttempts > 0 ? Math.max(...filteredHistory.map(h => h.score)) : 0;
  const averagePercentage = totalAttempts > 0 
    ? filteredHistory.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts 
    : 0;

  return (
    <div className="hero-section">
      {/* Background Graphic Patterns */}
      <div className="hero-bg-graphic">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="50" height="43.3" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <path d="M25 0 L50 14.4 L50 43.3 L25 57.7 L0 43.3 L0 14.4 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
        {/* Spotlights */}
        <div style={{ position: 'absolute', top: '25%', left: '25%', width: '500px', height: '500px', backgroundColor: 'rgba(255, 192, 0, 0.08)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '600px', height: '600px', backgroundColor: 'rgba(41, 171, 226, 0.04)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
      </div>

      <div className="hero-grid container-lambo relative z-10">
        {/* Left text column & selectors */}
        <div className="hero-content" style={{ width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%' }}
          >
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">
                EXAMINATION PREPARATION SUITE
              </span>
            </div>

            <h2 className="hero-title" style={{ marginBottom: '16px' }}>
              UNIVERSAL MCQ <br />
              <span className="text-lambo-gold">TESTING</span> PLATFORM
            </h2>

            <p className="hero-description" style={{ marginBottom: '24px' }}>
              Accelerate your preparation with subject-based MCQs. Select a subject and exam category below to start your test or review the answer keys.
            </p>
          </motion.div>

          {/* Select Subject Panel */}
          <div style={{ width: '100%', marginBottom: '20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-ash)', letterSpacing: '0.15em', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
              1. SELECT SUBJECT
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              {subjects.map(sub => {
                const hasSubjectDraft = drafts.some(d => d.subjectId === sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubjectId(sub.id);
                    }}
                    className={`subject-selector-btn ${selectedSubjectId === sub.id ? 'active' : ''}`}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <Book size={14} style={{ color: selectedSubjectId === sub.id ? 'var(--color-gold)' : 'var(--color-ash)' }} />
                      {sub.name}
                      {hasSubjectDraft && (
                        <span className="draft-badge">DRAFT</span>
                      )}
                    </span>
                    {selectedSubjectId === sub.id && <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-gold)' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Category Panel */}
          <div style={{ width: '100%', marginBottom: '24px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-ash)', letterSpacing: '0.15em', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
              2. SELECT EXAM TYPE
            </span>
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              {activeSubject?.categories.map(cat => {
                const hasCategoryDraft = drafts.some(d => d.subjectId === selectedSubjectId && d.categoryId === cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`category-selector-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {cat.name}
                      {hasCategoryDraft && (
                        <span className="draft-badge" style={{ fontSize: '8px', padding: '2px 4px' }}>DRAFT</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Active Draft Notice */}
          {activeDraft && (
            <div className="hero-draft-notice" style={{ marginBottom: '28px', width: '100%' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'rgba(255, 192, 0, 0.05)', border: '1px solid rgba(255, 192, 0, 0.2)', padding: '10px', color: 'var(--color-gold)', display: 'flex' }}>
                  <Edit size={16} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em', color: 'var(--color-gold-text)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Active Draft Progress Found
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-white)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>
                    {activeDraft.subjectName} • {activeDraft.categoryName}
                  </p>
                  <p style={{ fontSize: '10px', color: 'var(--color-ash)', marginBottom: '8px' }}>
                    Last Saved: {new Date(activeDraft.updatedAt).toLocaleString()}
                  </p>

                  {/* Progress Line */}
                  <div style={{ height: '4px', backgroundColor: 'var(--color-charcoal)', marginBottom: '8px', width: '100%', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${activeDraft.percentageCompleted}%`, backgroundColor: 'var(--color-gold)' }} />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-steel)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    <span>{activeDraft.percentageCompleted}% Complete</span>
                    <span>{activeDraft.answeredCount} / {activeDraft.totalQuestions} Answered</span>
                    <span>Question {activeDraft.currentQuestionNumber}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onResumeDraft(activeDraft)}
                      className="btn-accent"
                      style={{ height: '36px', padding: '0 16px', fontSize: '11px', gap: '4px' }}
                    >
                      <Play size={10} fill="currentColor" />
                      RESUME DRAFT
                    </button>
                    <button
                      onClick={() => onStartNewFromDraft(activeDraft)}
                      className="btn-ghost"
                      style={{ height: '36px', padding: '0 16px', fontSize: '11px' }}
                    >
                      START FRESH
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="hero-actions" style={{ width: '100%' }}>
            <button
              onClick={onStartQuiz}
              disabled={totalMCQsCount === 0}
              className="btn-accent"
              style={{ gap: '8px', flex: 1 }}
            >
              {totalMCQsCount === 0 ? (
                <>
                  <Calendar size={15} />
                  COMING SOON
                </>
              ) : (
                <>
                  <Play size={15} fill="currentColor" />
                  START TEST
                </>
              )}
            </button>

            <button
              onClick={onOpenBank}
              className="btn-ghost"
              style={{ gap: '8px', flex: 1 }}
            >
              <BookOpen size={15} />
              QUESTION BANK
            </button>
          </div>
        </div>

        {/* Right dashboard statistics column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="stats-panel"
        >
          <div className="stats-panel-accent" />

          <h3 className="stats-panel-title">
            <Award size={18} className="text-lambo-gold" />
            STATS OVERVIEW
          </h3>

          <div style={{ fontSize: '11px', color: 'var(--color-gold-text)', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {activeSubject?.name} • {activeCategory?.name}
          </div>

          <div className="stats-list">
            {/* Total Questions */}
            <div className="stats-item">
              <div>
                <span className="stats-item-label">TOTAL QUESTIONS</span>
                <div className="stats-item-val">{totalMCQsCount}</div>
              </div>
              <div className="stats-item-icon">
                <BookOpen size={18} />
              </div>
            </div>

            {/* Tests Attempted */}
            <div className="stats-item">
              <div>
                <span className="stats-item-label">TESTS ATTEMPTED</span>
                <div className="stats-item-val">{totalAttempts}</div>
              </div>
              <div className="stats-item-icon">
                <Play size={18} />
              </div>
            </div>

            {/* Best Score */}
            <div className="stats-item">
              <div>
                <span className="stats-item-label">PERSONAL BEST</span>
                <div className="stats-item-val">
                  {bestScore} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--color-ash)' }}>/{totalMCQsCount}</span>
                </div>
              </div>
              <div className="stats-item-icon" style={{ color: 'var(--color-cyan)' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>

            {/* Average Accuracy */}
            <div className="stats-item">
              <div>
                <span className="stats-item-label">AVG ACCURACY</span>
                <div className="stats-item-val">
                  {totalAttempts > 0 ? averagePercentage.toFixed(1) : "0.0"}%
                </div>
              </div>
              <div className="stats-item-icon" style={{ color: 'var(--color-white)' }}>
                <Award size={18} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
