"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const WelcomePage = () => {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur notre site !</h1>
        <p className="text-xl mb-8">
          Nous sommes ravis de vous accueillir ici.
        </p>
        <Button
          onClick={handleLogin}
          className="bg-white text-blue-600 hover:bg-blue-100"
        >
          Commencer l&apos;aventure
        </Button>
      </main>
      <footer className="mt-8 text-sm opacity-75">
        © {new Date().getFullYear()} Lilee. Tous droits réservés.
      </footer>
    </div>
  );
};

export default WelcomePage;
