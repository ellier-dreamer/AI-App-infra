import { requireUser } from "@/lib/auth/guards";
import { logoutAction } from "@/actions/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
