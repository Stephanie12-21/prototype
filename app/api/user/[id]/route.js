import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  const userId = params?.id;

  if (!userId || isNaN(userId)) {
    return NextResponse.json(
      { message: "ID de l'utilisateur manquant ou invalide." },
      { status: 400 }
    );
  }

  try {
    const user = await db.user.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        profileImages: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    const { hashPassword, ...userData } = user;

    return NextResponse.json(
      {
        user: userData,
        message: "Informations de l'utilisateur récupérées avec succès.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.formData();

    if (!id) {
      return new NextResponse(JSON.stringify({ message: "ID manquant" }), {
        status: 400,
      });
    }

    // Extraire les données du formulaire
    const username = body.get("username");
    const email = body.get("email");
    const images = body.getAll("image"); // Récupérer plusieurs fichiers

    // Validation des données
    if (!username || !email) {
      return new NextResponse(
        JSON.stringify({ message: "Tous les champs doivent être renseignés." }),
        { status: 400 }
      );
    }

    // Mise à jour des informations de l'utilisateur
    const updatedUser = await db.user.update({
      where: { id: parseInt(id, 10) },
      data: {
        username,
        email,
      },
    });

    // Si des fichiers d'image ont été fournis, mettre à jour les images
    if (images.length > 0) {
      await db.profileImage.deleteMany({
        where: { userId: updatedUser.id },
      });

      for (const file of images) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ko4bjtic");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dtryutlkz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.secure_url) {
          throw new Error("Échec du téléchargement de l'image");
        }

        const imageUrl = uploadResult.secure_url;

        await db.profileImage.create({
          data: {
            path: imageUrl,
            userId: updatedUser.id,
          },
        });
      }
    }

    return new NextResponse(
      JSON.stringify({ message: "Utilisateur mis à jour avec succès!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la mise à jour de l'utilisateur",
      }),
      { status: 500 }
    );
  }
}
