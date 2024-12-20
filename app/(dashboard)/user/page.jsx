"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart,
  Check,
  ChevronDown,
  CreditCard,
  HelpCircle,
  ImagePlus,
  LogOut,
  Puzzle,
  Rocket,
  Settings,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const { data: session } = useSession();

  const [user, setUser] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
  });
  const [selectedTab, setSelectedTab] = useState("accueil");

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'article avec l'ID : ${userId}?`
    );
    if (confirmed) {
      try {
        const response = await fetch(`/api/user/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert(`L'user avec l'ID : ${userId} a été supprimé.`);
        } else {
          throw new Error("Erreur lors de la suppression de l'user.");
        }
      } catch (error) {
        alert("Erreur lors de la suppression de l'user.");
        console.error("Erreur lors de la suppression de l'user :", error);
      }
    }
  };

  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Données reçues :", data);

          // Mise à jour de l'état avec les données reçues
          setUser(data.user);
          setProfileImage(
            data.user.profileImages[0]?.path ||
              "aucune image relative à ce compte"
          );
          setEditedUser({
            username: data.user.username,
            email: data.user.email,
          });
        } else {
          console.error("User non trouvé, avec l'id user :", userId);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'user :", error);
      }
    }

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const formData = new FormData();
        formData.append("email", editedUser.email);
        formData.append("username", editedUser.username);

        const response = await fetch(`/api/user/${userId}`, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Erreur lors de la modification."
          );
        }

        console.log("Modification réussie.");
        alert("Profil mis à jour avec succès.");
        setIsEditing(false); // Quitte le mode édition
      } catch (error) {
        console.error("Erreur :", error.message);
        alert(`Erreur : ${error.message}`);
      }
    } else {
      setIsEditing(true); // Passe en mode édition
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageDetails(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-blue-500" />,
      title: "Gestion de projets avancée",
      description: "Gérez vos projets avec des outils puissants et intuitifs",
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Collaboration en temps réel",
      description: "Travaillez ensemble efficacement, où que vous soyez",
    },
    {
      icon: <BarChart className="h-8 w-8 text-purple-500" />,
      title: "Analyses et rapports détaillés",
      description:
        "Prenez des décisions éclairées grâce à des données précises",
    },
    {
      icon: <Puzzle className="h-8 w-8 text-orange-500" />,
      title: "Intégrations",
      description: "Connectez-vous à vos outils favoris en quelques clics",
    },
  ];

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center  min-h-screen bg-gray-100">
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle className="text-2xl text-primary font-bold text-center">
              Connexion requise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6 text-gray-600">
              Veuillez vous connecter à votre compte pour continuer
            </p>
            <div className="flex justify-center">
              <Button asChild className="w-full">
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 p-4 bg-white shadow-sm rounded-lg">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="py-10 px-8" asChild>
              <Button
                variant="ghost"
                className="relative pl-2 pr-4 rounded-full transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-[60px] w-[60px] ring-2 ring-blue-100">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      <Image
                        src={session.user.image || "/default-avatar.png"}
                        alt="User profile"
                        width={60}
                        height={60}
                        className="w-[60px] h-[60px] rounded-full object-cover"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start ">
                    <span className="text-base font-medium">
                      {session.user.username}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                <span>Paiments effectués</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50 transition-colors cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-purple-500" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50 transition-colors cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4 text-orange-500" />
                <span>Aide</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-red-50 text-red-600 transition-colors cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <button onClick={handleSignOut}>Se déconnecter</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex justify-center mb-4">
          <TabsList className="flex space-x-36 px-8 py-9">
            <TabsTrigger value="accueil" className="text-base font-semibold">
              Accueil
            </TabsTrigger>
            <TabsTrigger value="abonnement">Abonnement</TabsTrigger>
            <TabsTrigger value="profil">Profil utilisateur</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="accueil" className="w-full space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-none">
            <CardHeader className="space-y-4">
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Bienvenue sur notre plateforme
                </CardTitle>
                <CardDescription className="text-lg">
                  Découvrez un espace de travail innovant conçu pour votre
                  réussite
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-white/80 rounded-lg backdrop-blur-sm">
                <p className="text-lg text-gray-600">
                  Notre plateforme est conçue pour vous aider à atteindre vos
                  objectifs rapidement et efficacement. Transformez votre façon
                  de travailler avec nos outils puissants et intuitifs.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/80 rounded-lg backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg flex items-center">
                          {feature.title}
                          <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ml-2" />
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center px-6 py-4">
              <Button
                variant="outline"
                className="border-2 hover:border-blue-500 transition-all duration-300"
              >
                En savoir plus
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Commencer maintenant
                <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="abonnement" className="w-full p-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card
              className={`relative overflow-hidden transition-all duration-500 transform hover:scale-105 flex flex-col
                ${
                  hoveredCard === "Standard"
                    ? "shadow-2xl -translate-y-2"
                    : "shadow hover:shadow-xl"
                }
                cursor-pointer`}
              onMouseEnter={() => setHoveredCard("Standard")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <CardHeader className="space-y-1 pb-6 transition-colors duration-300 hover:bg-slate-100">
                <CardTitle className="text-2xl font-bold transition-transform duration-300 ease-in-out">
                  Standard
                </CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">7.99 €</span>
                  <span className="text-sm text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <ul className="space-y-2">
                  {["1 boost URGENT", "2 boosts à la UNE"].map(
                    (feature, index) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 transform transition-all duration-300"
                        style={{
                          transitionDelay: `${index * 50}ms`,
                          opacity: hoveredCard === "Standard" ? 1 : 0.8,
                          transform:
                            hoveredCard === "Standard"
                              ? "translateX(10px)"
                              : "none",
                        }}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
              <div className="p-4">
                <button className="w-full rounded-md bg-slate-900 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:bg-slate-800 hover:shadow-lg transform hover:-translate-y-1">
                  Choisir Standard
                </button>
              </div>
            </Card>

            <Card
              className={`relative overflow-hidden transition-all duration-500 transform hover:scale-105 flex flex-col
        ${
          hoveredCard === "medium"
            ? "shadow-2xl -translate-y-2"
            : "shadow hover:shadow-xl"
        }
        cursor-pointer`}
              onMouseEnter={() => setHoveredCard("medium")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute -right-12 top-6 rotate-45 bg-blue-600 px-12 py-1 transform transition-transform duration-500 hover:scale-110">
                <span className="text-xs text-white">POPULAIRE</span>
              </div>
              <CardHeader className="space-y-1 pb-6 transition-colors duration-300 hover:bg-blue-50">
                <CardTitle className="text-2xl font-bold transition-transform duration-300 ease-in-out">
                  Medium
                </CardTitle>

                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">19.99€</span>
                  <span className="text-sm text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <ul className="space-y-2">
                  {["3 boosts URGENT", "2 boosts à la UNE"].map(
                    (feature, index) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 transform transition-all duration-300"
                        style={{
                          transitionDelay: `${index * 50}ms`,
                          opacity: hoveredCard === "medium" ? 1 : 0.8,
                          transform:
                            hoveredCard === "medium"
                              ? "translateX(10px)"
                              : "none",
                        }}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
              <div className="p-4">
                <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1">
                  Choisir Medium
                </button>
              </div>
            </Card>

            <Card
              className={`relative overflow-hidden transition-all duration-500 transform hover:scale-105 flex flex-col
                ${
                  hoveredCard === "premium"
                    ? "shadow-2xl -translate-y-2"
                    : "shadow hover:shadow-xl"
                }
                cursor-pointer`}
              onMouseEnter={() => setHoveredCard("premium")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader className="space-y-1 pb-6 transition-colors duration-300 hover:bg-purple-50">
                <CardTitle className="text-2xl font-bold transition-transform duration-300 ease-in-out">
                  Premium
                </CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">39.99€</span>
                  <span className="text-sm text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <ul className="space-y-2">
                  {[
                    "5 boosts URGENT",
                    "4 boosts à la UNE",
                    "2 boosts RECOMMANDATIONS",
                  ].map((feature, index) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 transform transition-all duration-300"
                      style={{
                        transitionDelay: `${index * 50}ms`,
                        opacity: hoveredCard === "premium" ? 1 : 0.8,
                        transform:
                          hoveredCard === "premium"
                            ? "translateX(10px)"
                            : "none",
                      }}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-4">
                <button className="w-full rounded-md bg-purple-600 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:bg-purple-700 hover:shadow-lg transform hover:-translate-y-1">
                  Choisir Premium
                </button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profil" className="w-full">
          <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4">
              <Card className="max-w-6xl mx-auto bg-white shadow-lg">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 border flex items-center justify-center p-8">
                      <Avatar className="w-52 h-52">
                        <AvatarImage
                          src={profileImage}
                          alt={user?.username || "Utilisateur"}
                          className="object-cover rounded-full"
                        />
                        <AvatarFallback className="bg-blue-200 text-blue-700 text-6xl w-full h-full">
                          {user?.username?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div className="mt-4">
                          <label className="cursor-pointer">
                            <ImagePlus className="text-8xl text-blue-500" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="md:w-1/2 p-8 space-y-6">
                      <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Profil Utilisateur
                      </h2>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="username"
                              className="text-sm font-medium text-gray-600"
                            >
                              Nom
                            </Label>
                            <Input
                              id="username"
                              value={
                                isEditing
                                  ? editedUser.username
                                  : user?.username || ""
                              }
                              readOnly={!isEditing}
                              onChange={handleInputChange}
                              className={`bg-gray-50 ${
                                isEditing ? "" : "cursor-not-allowed"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-600"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={
                              isEditing ? editedUser.email : user?.email || ""
                            }
                            readOnly={!isEditing}
                            onChange={handleInputChange}
                            className={`bg-gray-50 ${
                              isEditing ? "" : "cursor-not-allowed"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={handleEditClick}
                          className="mr-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          {isEditing
                            ? "Enregistrer les modifications"
                            : "Modifier le profil"}
                        </button>
                        {!isEditing && (
                          <button
                            onClick={handleDeleteClick}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Supprimer le profil
                          </button>
                        )}
                        {isEditing && (
                          <button
                            onClick={() => setIsEditing(false)}
                            className="ml-4 bg-gray-400 text-white px-4 py-2 rounded"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
