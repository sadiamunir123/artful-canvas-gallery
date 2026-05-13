import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = { variant?: "light" | "dark" };

const BackButton = ({ variant = "dark" }: Props) => {
  const navigate = useNavigate();
  const isLight = variant === "light";
  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="Go back"
      style={{
        position: "fixed",
        top: 72,
        left: 16,
        zIndex: 150,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        background: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.85)",
        color: isLight ? "#fff" : "#111",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 4,
        backdropFilter: "blur(6px)",
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
};

export default BackButton;
