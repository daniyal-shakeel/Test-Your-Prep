import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Search, Check, AlertCircle } from 'lucide-react';
export default function Results({ mcqs, answers, userAnswers, onRetake, onGoHome }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'correct', 'incorrect'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const totalQuestions = mcqs.length;
  
  // Calculate correct answers
  let correctCount = 0;
  let incorrectCount = 0;

  mcqs.forEach(q => {
    const isCorrect = userAnswers[q.id] === answers[q.id];
    if (isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  // Filter questions based on query and correct/incorrect status
  const filteredQuestions = mcqs.filter(q => {
    const isCorrect = userAnswers[q.id] === answers[q.id];
    const matchesFilter = 
      filterMode === 'all' ||
      (filterMode === 'correct' && isCorrect) ||
      (filterMode === 'incorrect' && !isCorrect);

    const matchesSearch = 
      q.id.toString().includes(searchQuery) ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="results-container">
      
      {/* Performance Score Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="results-dashboard"
      >
        <div className="results-dashboard-accent" />

        <h2 className="results-dashboard-title">
          PERFORMANCE REPORT
        </h2>

        <div className="results-grid">
          {/* Percentage display */}
          <div className="accuracy-circle-card">
            <span className="accuracy-label">ACCURACY</span>
            <span className="accuracy-value">
              {percentage.toFixed(1)}%
            </span>
          </div>

          {/* Stats detailed info */}
          <div className="results-stats-row">
            <div className="result-stat-item">
              <span className="result-stat-label">TOTAL MCQS</span>
              <span className="result-stat-val">{totalQuestions}</span>
            </div>

            <div className="result-stat-item correct">
              <span className="result-stat-label text-lambo-cyan">
                <CheckCircle2 size={11} />
                CORRECT
              </span>
              <span className="result-stat-val text-lambo-cyan">{correctCount}</span>
            </div>

            <div className="result-stat-item incorrect">
              <span className="result-stat-label text-red-500">
                <AlertTriangle size={11} />
                WRONG
              </span>
              <span className="result-stat-val text-red-400">{incorrectCount}</span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="results-actions-footer">
          <button onClick={onGoHome} className="btn-ghost">
            DASHBOARD
          </button>
          <button onClick={onRetake} className="btn-accent" style={{ gap: '8px' }}>
            <RefreshCw size={14} />
            RETAKE TEST
          </button>
        </div>
      </motion.div>

      {/* Detailed Correction reviews */}
      <div className="reviews-section">
        <div className="reviews-section-header">
          <h3 className="reviews-title">DETAILED REVIEW</h3>
          
          {/* Filter Bar */}
          <div className="reviews-filter-bar">
            <button
              onClick={() => setFilterMode('all')}
              className={`reviews-filter-btn ${filterMode === 'all' ? 'active' : ''}`}
            >
              ALL ({totalQuestions})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`reviews-filter-btn ${filterMode === 'correct' ? 'active' : ''}`}
              style={filterMode === 'correct' ? { backgroundColor: 'var(--color-cyan)', color: 'white' } : {}}
            >
              CORRECT ({correctCount})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`reviews-filter-btn ${filterMode === 'incorrect' ? 'active' : ''}`}
              style={filterMode === 'incorrect' ? { backgroundColor: 'var(--color-error)', color: 'white' } : {}}
            >
              INCORRECT ({incorrectCount})
            </button>
          </div>
        </div>

        {/* Search review bar */}
        <div className="search-wrapper">
          <Search className="search-icon-prefix" size={18} />
          <input
            type="text"
            placeholder="SEARCH REVIEW BY QUESTION STATEMENT OR ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="lambo-input"
          />
        </div>

        {/* Correction list */}
        <div className="reviews-list">
          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'var(--color-iron-dark)', border: '1px solid var(--color-charcoal)', color: 'var(--color-ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              NO QUESTIONS MATCH THE SEARCH OR FILTER.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const userAns = userAnswers[q.id];
              const correctAns = answers[q.id];
              const isCorrect = userAns === correctAns;
              const isExpanded = !!expandedQuestions[q.id];

              return (
                <div
                  key={q.id}
                  className={`review-item-card ${isCorrect ? 'correct' : 'incorrect'}`}
                >
                  {/* Collapsed Header */}
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="review-card-header"
                  >
                    <div className="review-card-title-group">
                      <span className="review-q-num">
                        {q.id}.
                      </span>
                      <p className="review-q-text">
                        {q.question}
                      </p>
                    </div>

                    <div className="review-status-col">
                      {isCorrect ? (
                        <span className="review-status-pill correct">
                          CORRECT
                        </span>
                      ) : (
                        <span className="review-status-pill incorrect">
                          INCORRECT
                        </span>
                      )}
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded Detail Body */}
                  {isExpanded && (
                    <div className="review-card-body">
                      <p className="review-expanded-question">
                        {q.question}
                      </p>
                      
                      <div className="review-options-grid">
                        {Object.entries(q.options).map(([key, val]) => {
                          if (!val) return null;
                          const isUserSelection = userAns === key;
                          const isCorrectChoice = correctAns === key;

                          let choiceClass = "review-option-pill";
                          if (isCorrectChoice) {
                            choiceClass += " correct";
                          } else if (isUserSelection) {
                            choiceClass += " incorrect";
                          }

                          return (
                            <div
                              key={key}
                              className={choiceClass}
                            >
                              <span className="option-letter">
                                {key}
                              </span>
                              <span>{val}</span>
                              {isCorrectChoice && (
                                <span className="review-option-pill-icon text-lambo-cyan">
                                  <Check size={14} />
                                </span>
                              )}
                              {!isCorrectChoice && isUserSelection && (
                                <span className="review-option-pill-icon text-red-500">
                                  <AlertCircle size={14} />
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Extra analysis box */}
                      <div className="review-footer-summary">
                        <span>
                          CORRECT ANSWER CORRESPONDING KEY: <strong className="text-lambo-cyan">{correctAns}</strong> | YOUR RESPONSE: <strong className={isCorrect ? "text-lambo-cyan" : "text-red-400"}>{userAns || "UNANSWERED"}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
