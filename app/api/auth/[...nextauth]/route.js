import NextAuth from "next-auth";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signup",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        console.log("Tentative de connexion avec:", credentials);
        if (!credentials?.email || !credentials.password) {
          console.log("Credentials manquants");
          return null;
        }

        const existingComptePerso = await db.user.findUnique({
          where: { email: credentials.email },
          include: { profileImages: true },
        });

        if (!existingComptePerso) {
          console.log("Utilisateur non trouvé");
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingComptePerso.hashPassword
        );
        if (!passwordMatch) {
          console.log("Mot de passe incorrect");
          return null;
        }

        console.log(
          "Authentification réussie pour :",
          existingComptePerso.email
        );

        const imageUrl =
          existingComptePerso.profileImages.length > 0
            ? existingComptePerso.profileImages[0].path
            : null;
        console.log("Utilisateur autorisé :", {
          id: existingComptePerso.id,
          username: existingComptePerso.username,
          email: existingComptePerso.email,
          dateCreation: existingComptePerso.createdAt,
          image: imageUrl,
        });
        return {
          id: `${existingComptePerso.id}`,
          username: existingComptePerso.username,
          email: existingComptePerso.email,
          dateCreation: existingComptePerso.createdAt,
          image: imageUrl,
        };
      },
    }),
  ],

  events: {
    createUser: async (message) => {
      const userId = message.user.id;
      const userEmail = message.user.email;

      if (!userId || !userEmail) {
        return;
      }

      try {
        const stripeCustomer = await stripe.customers.create({
          email: userEmail,
        });

        console.log("Stripe Customer Created:", stripeCustomer);
      } catch (error) {
        console.error("Error creating Stripe customer:", error);
      }
    },
  },

  //   callbacks: {
  //     async jwt({ token, user }) {
  //       if (user) {
  //         token.id = user.id || null;
  //         token.username = user.username || null;
  //         token.email = user.email || null;
  //         token.picture = user.image || null;
  //         token.name = user.nom || null;
  //         token.dateCreation = user.createdAt || null;
  //       } else {
  //         token.user = {
  //           id: token.id || null,
  //           username: token.username || null,
  //           email: token.email || null,
  //           picture: token.picture || null,
  //           name: token.nom || null,
  //           dateCreation: token.dateCreation || null,
  //         };
  //       }

  //       return token;
  //     },

  //     async session({ session, token }) {
  //       session.user = {
  //         ...session.user,
  //         id: token.id || null,
  //         username: token.username || null,
  //         name: token.nom || null,
  //         email: token.email || null,
  //         image: token.picture || null,
  //         dateCreation: token.dateCreation || null,
  //       };

  //       return session;
  //     },
  //   },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || null;
        token.username = user.username || null;
        token.email = user.email || null;
        token.picture = user.image || null;
        token.createdAt = user.createdAt || null;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id || null,
        username: token.username || null,
        email: token.email || null,
        image: token.picture || null,
        createdAt: token.createdAt || null,
      };

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
