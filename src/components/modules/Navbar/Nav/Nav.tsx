"use client";
import { useEffect, useState } from "react";
import styles from "../Navbar.module.css";
import { usePathname } from "next/navigation";

const Nav: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isPanelUserRoute =
    pathname.startsWith("/p-user") || pathname.startsWith("/p-admin");
    
  const [fixTop, setFixTop] = useState<boolean>(false);

  useEffect(() => {
    const fixNavbarToTop = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 105) {
        setFixTop(true);
      } else {
        setFixTop(false);
      }
    };
    window.addEventListener("scroll", fixNavbarToTop);

    return () => window.removeEventListener("scroll", fixNavbarToTop);
  }, []);

  return (
    <nav
      className={`${fixTop ? styles.navbar_fixed : styles.navbar}`}
      style={{ display: isPanelUserRoute ? "none" : "" }}
    >
      {children}
    </nav>
  );
};

export default Nav;
