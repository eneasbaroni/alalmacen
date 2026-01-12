import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/app/api/DAO/services/userService";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  // Verificar rol del usuario directamente desde la DB (sin fetch HTTP)
  try {
    const user = await UserService.findByEmail(session.user.email);

    if (!user) {
      redirect("/");
    }

    if (user.role !== "admin") {
      redirect("/profile");
    }

    return user;
  } catch (error) {
    console.error("Error checking admin access:", error);
    redirect("/");
  }
}
