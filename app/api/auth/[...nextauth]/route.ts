import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UserService } from "../../DAO/services/userService";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      if (!user.email) return false;

      try {
        const { user: dbUser, created } = await UserService.findOrCreate(
          user.email,
          user.name || (profile?.name as string)
        );

        console.log(
          created ? "New user created:" : "User already exists:",
          dbUser.email
        );

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
  },
  theme: {
    colorScheme: "dark", // "auto" | "dark" | "light"
    brandColor: "ffffff", // Hex color code
    logo: "/logoC.png", // Absolute URL to image
    buttonText: "ffffff", // Hex color code
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
