const Footer = () => {
  return (
    <footer className="footer footer-center text-white p-10 bg-gradient-to-r from-emerald-500 from-10% via-sky-500 via-30% to-indigo-500 to-90% rounded">
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      <aside>
        <p>Copyright © 2023 - All right reserved by DSE Diversification</p>
      </aside>
    </footer>
  );
};

export default Footer;
