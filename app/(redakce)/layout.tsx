import { AppShell } from "@/components/shell/app-shell";

export default function EditorLayout({ children }: LayoutProps<"/">) {
  return <AppShell variant="editor">{children}</AppShell>;
}
