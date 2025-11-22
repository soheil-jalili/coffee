"use client";
import "aos/dist/aos.css";

import { MdKeyboardArrowUp } from "react-icons/md";
import styles from "@/styles/ScrollToTop.module.css";
import React, { useEffect, useState } from "react";

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    const fixToTop = () => {
      const pageY = window.scrollY;
      if (pageY > 105) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", fixToTop);

    return () => window.removeEventListener("scroll", fixToTop);
  }, []);

  const goToTop = () => {
    isVisible &&
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
  };

  return (
    <button
      data-aos="fade-right"
      className={`${styles.button} ${isVisible ? styles.buttonVisible : ""}`}
      onClick={goToTop}
    >
      <MdKeyboardArrowUp />
    </button>
  );
};

export default ScrollToTop;
