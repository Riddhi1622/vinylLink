// src/app/components/Footer.js

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">VinylLINK</span>
        <span className="footer-copy">
          © {new Date().getFullYear()} VinylLINK. All rights reserved.
        </span>
        <span className="footer-eth">Built on Ethereum</span>
      </div>
    </footer>
  );
}