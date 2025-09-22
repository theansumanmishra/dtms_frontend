const Footer = ({ children }) => {
  
  return (
<footer className="bg-body-tertiary text-center text-lg-start" 
      style={{
          // marginBottom:"50px",
          position: "fixed",
          width: "100%",
          bottom: 0,
          margin: 0,
          zIndex: 8
        }}>
      {/* Extra content like pagination will be injected here */}
      {children && <div className="py-3">{children}</div>}

      {/* Copyright section */}
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © {new Date().getFullYear()} Copyright: Dispute Tracking & Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
