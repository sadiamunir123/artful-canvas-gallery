import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useArtworks } from "@/hooks/useArtworks";

const Index = () => {
  const { data: paintings = [] } = useArtworks();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (paintings.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % paintings.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [paintings.length]);

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  const previousPainting = () => {
    if (paintings.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + paintings.length) % paintings.length);
  };

  const nextPainting = () => {
    if (paintings.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % paintings.length);
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Navbar />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000000",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {paintings.map((painting, index) => (
          <div
            key={painting.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: index === currentIndex ? 1 : 0,
              transition: "opacity 1.2s ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000000",
              pointerEvents: index === currentIndex ? "auto" : "none",
            }}
          >
            <img
              src={painting.image}
              alt={painting.title}
              draggable={false}
              style={{
                maxWidth: "100vw",
                maxHeight: "100vh",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        ))}

        {paintings.length > 1 && (
          <>
            <button
              onClick={previousPainting}
              aria-label="Previous painting"
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                fontSize: "24px",
                padding: "12px 16px",
                cursor: "pointer",
                borderRadius: "4px",
                zIndex: 10,
              }}
            >
              ‹
            </button>

            <button
              onClick={nextPainting}
              aria-label="Next painting"
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                fontSize: "24px",
                padding: "12px 16px",
                cursor: "pointer",
                borderRadius: "4px",
                zIndex: 10,
              }}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;