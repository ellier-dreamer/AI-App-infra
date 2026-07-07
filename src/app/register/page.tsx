import { redirectIfAuthenticated } from "@/lib/auth/guards";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <RegisterForm />
    </div>
  );
}
