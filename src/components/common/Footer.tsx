/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 
 */
import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
    const year = new Date().getFullYear()
    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <div className="site-footer-left">
                    <span className="site-footer-brand">mp3-to-wav.xyh.wiki</span>
                    <span className="site-footer-copy">© {year} mp3-to-wav. All rights reserved.</span>
                </div>
                <nav className="site-footer-links">
                    <Link to="/about" className="site-footer-link">
                        About
                    </Link>
                    <Link to="/faq" className="site-footer-link">
                        FAQ
                    </Link>
                    <Link to="/privacy" className="site-footer-link">
                        Privacy
                    </Link>
                    <Link to="/terms" className="site-footer-link">
                        Terms
                    </Link>
                    <Link to="/sitemap" className="site-footer-link">
                        Sitemap
                    </Link>
                </nav>
            </div>

            <style>{`
        .site-footer {
          border-top: 1px solid #e4e4e7;
          padding: 16px 0;
          margin-top: 40px;
          font-size: 13px;
          color: #71717a;
          background: #fafafa;
        }
        .site-footer-inner {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0 16px;
        }
        .site-footer-left {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
        .site-footer-brand {
          font-weight: 600;
          color: #27272a;
        }
        .site-footer-copy {
          color: #a1a1aa;
        }
        .site-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .site-footer-link {
          color: #52525b;
          text-decoration: none;
        }
        .site-footer-link:hover {
          text-decoration: underline;
        }
      `}</style>
        </footer>
    )
}

export default Footer