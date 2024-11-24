import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requiredRole?: "ADMIN" | "CREATOR" | "USER") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else if (requiredRole && session.user.role !== requiredRole) {
      if (requiredRole === "ADMIN" && session.user.role !== "ADMIN") {
        router.push("/dashboard");
      } else if (
        requiredRole === "CREATOR" &&
        !["ADMIN", "CREATOR"].includes(session.user.role)
      ) {
        router.push("/dashboard");
      }
    }
  }, [session, status, requiredRole, router]);

  return {
    session,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    role: session?.user?.role,
  };
}
