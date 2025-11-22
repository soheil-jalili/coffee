import styles from "@/styles/login-register.module.css";


import LoginRegisterCheck from "@/components/templates/login-register/LoginRegisterCheck";

const LoginRegister = () => {
  return (
    <div className={styles.login_register}>
      <LoginRegisterCheck />
    </div>
  );
};

export default LoginRegister;
