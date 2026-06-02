import { ShieldAlert, Monitor } from 'lucide-react';

export default function TopWarningBanner() {
  return (
    <div className="top-warning-banner">
      <div className="top-warning-banner-pulse" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Monitor size={14} />
          <strong>DEVICE:</strong> BEST EXPERIENCE ON LAPTOP / DESKTOP (NOT OPTIMIZED FOR MOBILE DEVICES)
        </span>
        <span style={{ color: 'var(--color-ash)', display: 'none', md: 'inline' }}>|</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} style={{ color: 'var(--color-error)' }} />
          <strong>DISCLAIMER:</strong> THE AUTHOR IS NOT LIABLE FOR ANY INACCURACIES, MISSING QUESTIONS, OR ERRORS
        </span>
      </div>
    </div>
  );
}
