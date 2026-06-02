import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Award, CheckCircle2, AlertCircle, Trash2, Play, BookOpen } from 'lucide-react';

export default function History({
  isOpen,
  onClose,
  historyLog,
  onClearHistory,
  drafts = [],
  onResumeDraft,
  onDeleteDraft,
  onStartNewFromDraft,
  activeTab = 'history',
  setActiveTab
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const [lastOpenAndTab, setLastOpenAndTab] = useState({ isOpen, activeTab });
  if (lastOpenAndTab.isOpen !== isOpen || lastOpenAndTab.activeTab !== activeTab) {
    setLastOpenAndTab({ isOpen, activeTab });
    setSearchQuery('');
  }

  // Filter history records
  const filteredHistory = historyLog.filter(attempt => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const dateText = new Date(attempt.date).toLocaleString().toLowerCase();
    const subName = (attempt.subjectName || '').toLowerCase();
    const catName = (attempt.categoryName || '').toLowerCase();
    return subName.includes(query) || catName.includes(query) || dateText.includes(query);
  });

  // Filter drafts
  const filteredDrafts = drafts.filter(draft => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const dateText = new Date(draft.updatedAt).toLocaleString().toLowerCase();
    const subName = (draft.subjectName || '').toLowerCase();
    const catName = (draft.categoryName || '').toLowerCase();
    return subName.includes(query) || catName.includes(query) || dateText.includes(query);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="drawer-backdrop-wrap">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="drawer-backdrop"
          />

          {/* Drawer Wrapper */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="drawer-container"
          >
            {/* Header */}
            <div className="drawer-header" style={{ paddingBottom: '12px' }}>
              <div className="drawer-tabs-header">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`drawer-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                >
                  Marks History
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`drawer-tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
                  style={{ position: 'relative' }}
                >
                  Draft Tests
                  {drafts.length > 0 && (
                    <span className="drafts-count-indicator">
                      {drafts.length}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={onClose}
                className="drawer-close-btn"
                title="Close drawer"
                style={{ alignSelf: 'center', marginTop: '-6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Live Search Input Box */}
            <div style={{ padding: '0 24px', marginBottom: '16px' }}>
              <div className="drawer-search-wrapper">
                <input
                  type="text"
                  placeholder={`SEARCH ${activeTab === 'history' ? 'HISTORY' : 'DRAFTS'} BY SUBJECT, TYPE, DATE...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="lambo-input"
                  style={{ height: '36px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                />
              </div>
            </div>

            {/* Body Content */}
            <div className="drawer-content" style={{ flexGrow: 1, overflowY: 'auto' }}>
              {activeTab === 'history' ? (
                /* History Tab */
                filteredHistory.length === 0 ? (
                  <div className="drawer-empty-state">
                    <div className="drawer-empty-icon">
                      <Award size={32} />
                    </div>
                    <p>
                      {searchQuery ? "NO MATCHING RECORDS FOUND." : "NO PREVIOUS ATTEMPTS FOUND."}
                      <br />
                      START A TEST TO LOG YOUR PROGRESS.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="drawer-history-meta">
                      <span className="drawer-history-meta-title">
                        {filteredHistory.length} ATTEMPT{filteredHistory.length > 1 ? 'S' : ''} SHOWN
                      </span>
                      <button
                        onClick={onClearHistory}
                        className="drawer-clear-btn"
                      >
                        <Trash2 size={13} />
                        CLEAR LOGS
                      </button>
                    </div>

                    <div className="drawer-history-list">
                      {filteredHistory.map((attempt) => (
                        <div
                          key={attempt.id}
                          className="drawer-history-card"
                        >
                          <div className="drawer-card-header" style={{ marginBottom: '8px' }}>
                            <span className="drawer-card-date">
                              <Calendar size={11} />
                              {new Date(attempt.date).toLocaleString()}
                            </span>
                            <span className="drawer-card-pct">
                              {attempt.percentage.toFixed(1)}%
                            </span>
                          </div>

                          <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-gold-text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {attempt.subjectName} • {attempt.categoryName}
                          </div>

                          <div className="drawer-card-stats">
                            <div className="drawer-card-stat-box">
                              <div className="drawer-card-stat-label">SCORE</div>
                              <div className="drawer-card-stat-val">
                                {attempt.score}/{attempt.totalQuestions}
                              </div>
                            </div>

                            <div className="drawer-card-stat-box success">
                              <div className="drawer-card-stat-label">
                                <CheckCircle2 size={10} className="text-lambo-cyan" />
                                CORRECT
                              </div>
                              <div className="drawer-card-stat-val text-lambo-cyan">
                                {attempt.correctAnswersCount}
                              </div>
                            </div>

                            <div className="drawer-card-stat-box danger">
                              <div className="drawer-card-stat-label">
                                <AlertCircle size={10} style={{ color: 'var(--color-error)' }} />
                                WRONG
                              </div>
                              <div className="drawer-card-stat-val" style={{ color: 'var(--color-error)' }}>
                                {attempt.incorrectAnswersCount}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                /* Drafts Tab */
                filteredDrafts.length === 0 ? (
                  <div className="drawer-empty-state">
                    <div className="drawer-empty-icon">
                      <BookOpen size={32} />
                    </div>
                    <p>
                      {searchQuery ? "NO MATCHING DRAFTS FOUND." : "NO UNFINISHED DRAFTS FOUND."}
                      <br />
                      PROGRESS ON INCOMPLETE TESTS WILL SHOW HERE.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="drawer-history-meta">
                      <span className="drawer-history-meta-title">
                        {filteredDrafts.length} DRAFT{filteredDrafts.length > 1 ? 'S' : ''} SHOWN
                      </span>
                    </div>

                    <div className="drawer-history-list">
                      {filteredDrafts.map((draft) => (
                        <div
                          key={draft.draftId}
                          className="drawer-history-card"
                          style={{ borderLeft: '3px solid var(--color-gold)' }}
                        >
                          <div className="drawer-card-header" style={{ marginBottom: '6px' }}>
                            <span className="drawer-card-date">
                              <Calendar size={11} />
                              UPDATED: {new Date(draft.updatedAt).toLocaleString()}
                            </span>
                            <span className="drawer-card-pct" style={{ color: 'var(--color-gold-text)' }}>
                              {draft.percentageCompleted}%
                            </span>
                          </div>

                          <h4 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.02em', color: 'var(--color-white)' }}>
                            {draft.subjectName}
                          </h4>
                          <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-steel)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {draft.categoryName} • {draft.answeredCount} / {draft.totalQuestions} ANSWERED
                          </div>

                          {/* Progress Line */}
                          <div className="draft-progress-track" style={{ height: '4px', backgroundColor: 'var(--color-charcoal)', marginBottom: '12px', width: '100%', overflow: 'hidden' }}>
                            <div className="draft-progress-bar" style={{ height: '100%', width: `${draft.percentageCompleted}%`, backgroundColor: 'var(--color-gold)' }} />
                          </div>

                          <div style={{ fontSize: '11px', color: 'var(--color-ash)', marginBottom: '16px', letterSpacing: '0.02em' }}>
                            CONTINUE FROM QUESTION <strong className="text-lambo-gold">{draft.currentQuestionNumber}</strong>
                          </div>

                          {/* Actions Row */}
                          <div className="draft-card-actions">
                            <button
                              onClick={() => {
                                onResumeDraft(draft);
                                onClose();
                              }}
                              className="btn-accent"
                              style={{ flex: '1 1 auto', height: '32px', padding: '0 12px', fontSize: '10px', gap: '4px' }}
                            >
                              <Play size={10} fill="currentColor" />
                              RESUME
                            </button>

                            <button
                              onClick={() => {
                                onStartNewFromDraft(draft);
                                onClose();
                              }}
                              className="btn-ghost"
                              style={{ flex: '1 1 auto', height: '32px', padding: '0 12px', fontSize: '10px', gap: '4px' }}
                            >
                              START FRESH
                            </button>

                            <button
                              onClick={() => onDeleteDraft(draft)}
                              className="drawer-clear-btn"
                              style={{ border: '1px solid rgba(230, 57, 70, 0.2)', padding: '8px 10px', color: 'var(--color-error)' }}
                              title="Delete Draft Progress"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
