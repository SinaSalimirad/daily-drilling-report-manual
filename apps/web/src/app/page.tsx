import { redirect } from "next/navigation";

// There is no public landing page: the app starts at the dashboard, which sends a visitor
// without a session on to /login.
export default function Home() {
  redirect("/dashboard");
}
