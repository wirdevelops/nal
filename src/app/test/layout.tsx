import { TestNav } from "./components/test-nav";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TestNav />
      {children}
    </div>
  );
}
