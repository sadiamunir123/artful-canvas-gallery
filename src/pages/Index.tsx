import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useArtworks } from "@/hooks/useArtworks";

const Index = () => {
  const { data: paintings = [] } = useArtworks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (paintings.length === 0) return;
    const timer = setInterval(() => {
      setZoomed(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % paintings.length);
        setZoomed(true);
      }, 1200);
    }, 5000);
    return () => clearInterval(timer);
  }, [paintings.length]);

  useEffect(() => {
    setZoomed(true);
  }, [currentIndex]);

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
    setZoomed(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + paintings.length) % paintings.length);
    }, 300);
  };

  const nextPainting = () => {
    if (paintings.length === 0) return;
    setZoomed(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % paintings.length);
    }, 300);
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
              overflow: "hidden",
            }}
          >
            <img
              src={painting.image}
              alt={painting.title}
              draggable={false}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        ))}

      </div>
    </div>
  );
};

export default Index;
