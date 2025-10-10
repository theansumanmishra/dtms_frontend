import { useNavigate } from "react-router";
import "./Breadcrum.css";

const Breadcrum = ({ breadCrumItems }) => {
  const navigate = useNavigate();

  return (
    <nav aria-label="breadcrumb" className="breadcrum-container">
      <ol className="breadcrumb">
        {breadCrumItems.map((item, index) => (
          <li
            className={item.path ? "breadcrumb-item" : "breadcrumb-item active"}
            key={index}
            onClick={() => (item.path ? navigate(item.path) : null)}
          >
            {item.name}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrum;
