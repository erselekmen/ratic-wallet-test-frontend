import { Link } from "react-router-dom";
import "assets/styles/ratic.css";
import logoMor from "assets/img/logo/ratic.png";

export default function Header() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "calc(100% - 32px)",
        position: "fixed",
        top: "0",
        left: "0",
        height: "48px",
        padding: "16px",
        boxShadow: "rgb(4 17 29 / 25%) 0px 0px 8px 0px",
        backgroundColor: "white",
        zIndex: 100,
      }}
    >
      <Link to="/" style={{ display: "flex" }}>
        <img src={logoMor} alt="logo" style={{ height: "48px" }}></img>
      </Link>
    </div>
  );
}
