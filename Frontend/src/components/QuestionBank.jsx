import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, Check, BookOpen, Layers } from 'lucide-react';
import ComingSoon from './ComingSoon';

export default function QuestionBank({
  subjects,
  selectedSubjectId,
  setSelectedSubjectId,
  selectedCategoryId,
  setSelectedCategoryId,
  mcqs,
  answers
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const activeSubject = subjects.find(s => s.id === selectedSubjectId);
  const activeCategory = activeSubject?.categories.find(c => c.id === selectedCategoryId);

  const currentQuestions = useMemo(() => {
    return mcqs[selectedSubjectId]?.[selectedCategoryId] || [];
  }, [mcqs, selectedSubjectId, selectedCategoryId]);

  const currentAnswers = useMemo(() => {
    return answers[selectedSubjectId]?.[selectedCategoryId] || {};
  }, [answers, selectedSubjectId, selectedCategoryId]);

  const keyDistribution = useMemo(() => {
    const dist = { A: 0, B: 0, C: 0, D: 0 };
    currentQuestions.forEach(q => {
      const correctAns = currentAnswers[q.id];
      if (correctAns && dist[correctAns] !== undefined) {
        dist[correctAns]++;
      }
    });
    return dist;
  }, [currentQuestions, currentAnswers]);

  // Reset expanded id if subject or category changes
  const handleSubjectChange = (subId) => {
    setSelectedSubjectId(subId);
    setExpandedId(null);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategoryId(catId);
    setExpandedId(null);
  };

  // Filter logic memoized
  const filteredMCQs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return currentQuestions;

    const isNum = !isNaN(query);
    
    return currentQuestions.filter(q => {
      if (isNum) {
        return q.id.toString() === query;
      }
      return (
        q.question.toLowerCase().includes(query) ||
        Object.values(q.options).some(opt => opt && opt.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, currentQuestions]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper function to highlight matching search term
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    const trimmedQuery = query.trim();
    
    // Protect from special regex characters
    const escapedQuery = trimmedQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <mark key={index} className="bg-[#FFC000] text-black px-0.5 font-bold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="bank-container">
      
      {/* Header section */}
      <div className="bank-header-row">
        <div className="bank-title-group">
          <h2>
            QUESTION BANK <span className="text-lambo-gold font-mono">/ ANSWER KEY</span>
          </h2>
          <p>
            REFERENCE SHEET AND ANSWER REVELATION DIRECTORY
          </p>
        </div>
        
        {currentQuestions.length > 0 && (
          <div className="bank-stats-text">
            <span>
              SHOWING <strong>{filteredMCQs.length}</strong> OF {currentQuestions.length} MCQS
            </span>
          </div>
        )}
      </div>

      {/* Selectors inside Question Bank Page */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', backgroundColor: 'var(--color-iron-dark)', border: '1px solid var(--color-charcoal)', padding: '24px' }}>
        
        {/* Subject buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-ash)', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={12} />
            SUBJECT
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {subjects.map(sub => (
              <button
                key={sub.id}
                onClick={() => handleSubjectChange(sub.id)}
                className={`reviews-filter-btn ${selectedSubjectId === sub.id ? 'active' : ''}`}
                style={{
                  padding: '10px 16px',
                  fontSize: '11px',
                  border: selectedSubjectId === sub.id ? '1px solid var(--color-gold)' : '1px solid var(--color-charcoal)',
                  backgroundColor: selectedSubjectId === sub.id ? 'rgba(255,192,0,0.05)' : 'transparent',
                  color: selectedSubjectId === sub.id ? 'var(--color-gold-text)' : 'var(--color-ash)',
                  fontWeight: '700',
                  height: '38px',
                  flex: '1 1 auto',
                  textAlign: 'center'
                }}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-ash)', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={12} />
            EXAM TYPE
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {activeSubject?.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  height: '34px',
                  border: selectedCategoryId === cat.id ? '1px solid var(--color-white)' : '1px solid var(--color-charcoal)',
                  backgroundColor: selectedCategoryId === cat.id ? 'var(--color-charcoal)' : 'transparent',
                  color: selectedCategoryId === cat.id ? 'var(--color-white)' : 'var(--color-ash)',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: '700',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentQuestions.length === 0 ? (
        <ComingSoon subjectName={activeSubject?.name} categoryName={activeCategory?.name} />
      ) : (
        <>
          {/* MCQ Key Distribution Stats Dashboard */}
          <div className="stats-grid-lambo">
            {Object.entries(keyDistribution).map(([label, count], index) => (
              <motion.div
                key={label}
                className="stat-card-lambo"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -3 }}
              >
                <div className="stat-card-label">Option {label}</div>
                <div className="stat-card-value">{count}</div>
                <div className="stat-card-meta">Correct Key Answers</div>
                <div className="stat-card-accent" />
              </motion.div>
            ))}
          </div>

          {/* Real-time Search Box */}
          <div className="search-wrapper">
            <Search className="search-icon-prefix" size={18} />
            <input
              type="text"
              placeholder="SEARCH BY NUMBER, STATEMENT, OR OPTIONS KEYWORDS (E.G. 'INTENT', '68')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lambo-input"
            />
          </div>

          {/* MCQs List */}
          <div className="reviews-list">
            {filteredMCQs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'var(--color-iron-dark)', border: '1px solid var(--color-charcoal)', color: 'var(--color-ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                NO MATCHING QUESTIONS FOUND. PLEASE TRY A DIFFERENT KEYWORD OR ID.
              </div>
            ) : (
              filteredMCQs.map((q) => {
                const correctAns = currentAnswers[q.id];
                const isExpanded = expandedId === q.id;

                return (
                  <div
                    key={q.id}
                    className="review-item-card"
                    style={isExpanded ? { borderColor: 'var(--color-graphite)' } : {}}
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
                        <h4 className="review-q-text">
                          {highlightText(q.question, searchQuery)}
                        </h4>
                      </div>

                      <div className="review-status-col">
                        <span className="review-status-pill correct">
                          KEY: {correctAns}
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Expanded Body containing options and answer details */}
                    {isExpanded && (
                      <div className="review-card-body">
                        {/* Cased Options */}
                        <div className="review-options-grid">
                          {Object.entries(q.options).map(([key, val]) => {
                            if (!val) return null;
                            const isCorrect = key === correctAns;

                            let choiceClass = "review-option-pill";
                            if (isCorrect) {
                              choiceClass += " correct";
                            }

                            return (
                              <div
                                key={key}
                                className={choiceClass}
                              >
                                <span className="option-letter">
                                  {key}
                                </span>
                                <span style={{ paddingRight: '20px' }}>
                                  {highlightText(val, searchQuery)}
                                </span>
                                {isCorrect && (
                                  <span className="review-option-pill-icon text-lambo-cyan">
                                    <Check size={14} />
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Correct key footer */}
                        <div className="review-footer-summary">
                          <span>
                            CORRECT ANSWER KEY: <strong className="text-lambo-cyan font-mono">{correctAns}</strong>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

    </div>
  );
}
