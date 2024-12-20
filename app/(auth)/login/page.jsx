"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const emailLoginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit comporter au moins 8 caractères"),
  });

  const handleSubmit = async () => {
    try {
      emailLoginSchema.parse({ email, password });

      const loginData = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginData?.error) {
        console.error("Login error:", loginData.error);
        setAlertMessage("Identifiants incorrects");

        return;
      }

      console.log("Login successful:", loginData);
      router.push("/user");
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation failed:", error.errors);
      } else {
        console.error("Login error:", error);
        setAlertMessage(
          "Une erreur s'est produite lors de la connexion. Veuillez réessayer."
        );
      }
    }
  };
  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour vous connecter
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col justify-center space-y-3">
          <Button onClick={handleSubmit} className="w-full">
            Se connecter
          </Button>
          <Button onClick={handleSignup} className="w-full">
            S&apos;inscrire
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
