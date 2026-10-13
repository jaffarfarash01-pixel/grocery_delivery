
function Footer({ storeName, message }) {
  return (
    <footer className="footer">
      <h3>{storeName}</h3>
      <p>{message}</p>
      <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
