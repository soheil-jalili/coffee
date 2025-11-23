import styles from "./sms.module.css";

type Prop = {
  hideOtpForm: () => void;
  phoneNumber: string;
};

const Sms = ({ hideOtpForm, phoneNumber }: Prop) => {
  return (
    <>
      <div className={styles.form}>
        <p>کد تایید</p>
        <span className={styles.code_title}>
          لطفاً کد تأیید ارسال شده را تایپ کنید
        </span>
        <span className={styles.number}>{phoneNumber}</span>
        <input className={styles.input} type="text" />
        <button style={{ marginTop: "1rem" }} className={styles.btn}>
          ثبت کد تایید
        </button>
        <p className={styles.send_again_code}>ارسال مجدد کد یکبار مصرف</p>
      </div>
      <p
        className={styles.redirect_to_home}
        onClick={() => {
          hideOtpForm();
        }}
      >
        لغو
      </p>
    </>
  );
};

export default Sms;
