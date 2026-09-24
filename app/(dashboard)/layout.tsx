import DashboardShell from "@/layout/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactElement}) {
  return <DashboardShell>{children}</DashboardShell>;
}
