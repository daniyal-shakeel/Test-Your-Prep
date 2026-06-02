import { Terminal, Code, Award } from 'lucide-react';

export default function AuthorFooter() {
  return (
    <footer className="author-footer">
      <div className="author-footer-container">
        
        {/* Title / Branding badge */}
        <span className="author-footer-title">
          PLATFORM AUTHOR & CREATOR
        </span>

        {/* Author Name */}
        <h3 className="author-footer-name">
          MUHAMMAD DANIYAL SHAKEEL
        </h3>

        {/* Divider */}
        <div className="author-footer-divider" />

        {/* Metadata Details */}
        <div className="author-footer-meta">
          <div className="author-footer-meta-item">
            <Terminal size={12} className="text-lambo-gold" />
            <span>ROLL NO: G3F22UBSCS063</span>
          </div>
          
          <div className="author-footer-meta-item">
            <Award size={12} className="text-lambo-gold" />
            <span>SEMESTER: BSCS8B</span>
          </div>

          <div className="author-footer-meta-item">
            <Code size={12} className="text-lambo-gold" />
            <span>SOFTWARE ENGINEER &amp; FULL STACK DEVELOPER</span>
          </div>
        </div>

        {/* Small bottom copyright / disclaimer note */}
        <p className="author-footer-disclaimer">
          © {new Date().getFullYear()} ALL RIGHTS RESERVED. THIS APPLICATION IS DESIGNED EXCLUSIVELY FOR MID-TERM MCQ EXAMINATION PREPARATION.
        </p>

      </div>
    </footer>
  );
}
