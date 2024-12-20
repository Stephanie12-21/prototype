"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Signup = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      const response = await fetch("/api/user/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi des données.");
      } else {
        router.push(`/login`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Veuillez télécharger un fichier image valide.");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageFile(file);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Créer un compte
        </h2>
        <form className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-base font-medium text-gray-700"
              >
                Nom d&apos;utilisateur
              </label>
              <input
                id="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-4">
              <label className="text-balance text-[16px] text-muted-foreground max-md:text-center pb-6">
                L&apos;ajout de l&apos;image est optionnelle.
              </label>
              <input
                type="file"
                accept="image/*"
                id="imageFile"
                onChange={handleImageChange}
                className="bg-white p-2 border border-gray-300 rounded"
              />
              {selectedImage && (
                <div className="mt-2 flex">
                  <Image
                    src={selectedImage}
                    alt="Selected preview"
                    width={300}
                    height={200}
                    className="h-48 w-80 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </form>
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            S&apos;inscrire
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
