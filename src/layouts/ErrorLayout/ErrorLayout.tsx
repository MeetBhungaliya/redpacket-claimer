import Link from "next/link";

export const metadata = {
  title: "Something is wrong",
  description: "Something is wrong",
};

export default function ErrorLayout({ children }) {
  return (
    <div>
      {children}
      <Link href="/">Go back to home</Link>
    </div>
  );
}
