import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("resend", {
          email: formData.get("email") as string,
          redirectTo: "/products",
        });
      }}
    >
      <input type="text" name="email" placeholder="Email" />
      <button type="submit">Signin with Resend</button>
    </form>
  );
}
