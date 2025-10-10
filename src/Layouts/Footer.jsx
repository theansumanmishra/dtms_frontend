const Footer = ({ children }) => {
  return (
    <footer className="bg-body-tertiary text-center text-lg-start mt-3">
      {children && <div className="py-3">{children}</div>}

      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © {new Date().getFullYear()} Copyright: Dispute Tracking & Management
        System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
