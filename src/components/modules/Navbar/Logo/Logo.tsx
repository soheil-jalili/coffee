import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <div>
      <Link href="/">
        <img src="/images/logo.png" alt="Logo" />
      </Link>
    </div>
  );
};

export default Logo;
