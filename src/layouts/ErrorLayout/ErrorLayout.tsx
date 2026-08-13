export default function ErrorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <a href="/">Go back to home</a>
    </div>
  );
}
