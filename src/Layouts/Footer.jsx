const Footer = ({ children }) => {
  
  return (
<footer className="bg-body-tertiary text-center text-lg-start">
      {/* Extra content like pagination will be injected here */}
      {children && <div className="py-3">{children}</div>}

      {/* Copyright section */}
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © {new Date().getFullYear()} Copyright: Dispute Tracking & Management System. All rights reserved.
        {/* <a className="text-body" href="https://mdbootstrap.com/">
          MDBootstrap.com
        </a> */}
      </div>
    </footer>
  );
};

export default Footer;
