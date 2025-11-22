"use client";
import styles from "@/styles/login-register.module.css";
import { LoginRegisterType } from "@/utils/constant";
import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const LoginRegisterCheck = () => {
  const [authType, setAuthType] = useState<LoginRegisterType>("LOGIN");
  const showRegisterForm = () => setAuthType("REGISTER");
  const showLoginForm = () => setAuthType("LOGIN");
  return (
    <>
      <div className={styles.form_bg} data-aos="fade-up">
        {authType === "LOGIN" ? (
          <Login showRegisterForm={showRegisterForm} />
        ) : (
          <Register showloginForm={showLoginForm} />
        )}
      </div>
      <section>
        <img
          src="https://neurosciencenews.com/files/2023/06/coffee-brain-caffeine-neuroscincces.jpg"
          alt=""
        />
      </section>
    </>
  );
};

export default LoginRegisterCheck;
