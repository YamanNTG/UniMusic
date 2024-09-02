"use server";
import { v2 as cloudinary } from "cloudinary";
import {
  createReviewSchema,
  imageSchema,
  instrumentSchema,
  profileSchema,
  validateWithZodSchema,
} from "./schemas";
import db from "./db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageToCloudinary } from "./cloudinary";
import { error } from "console";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// with auth you can select just the id
// with currentUser we get the entire user
//clerkClient is used to access the metadata and update it

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }
  if (!user.privateMetadata.hasProfile) redirect("/profile/create");
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error ocurred",
  };
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Please login to creeate a profile");

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/");
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });
  return profile?.profileImage;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!profile) return redirect("profile/create");
  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });
    revalidatePath("/profile");
    return { message: "Profile Updated Successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const ProfileFile = formData.get("profileImage") as File;
    const validatedProfileFile = validateWithZodSchema(imageSchema, {
      image: ProfileFile,
    });
    // Convert the File objects to Buffers
    const profileBuffer = Buffer.from(
      await validatedProfileFile.image.arrayBuffer()
    );
    // Upload the images to Cloudinary
    const ProfileImageUrl = await uploadImageToCloudinary(profileBuffer, {
      folder: "profile_images",
      public_id: `${user.id}_image`,
    });

    // Update the user's profile image URL in the database
    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: ProfileImageUrl,
      },
    });

    // Revalidate the profile path
    revalidatePath("/profile");

    return { message: "Profile image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const createInstrumentAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const instrumentFile = formData.get("image") as File;

    const validatedFields = validateWithZodSchema(instrumentSchema, rawData);
    const category = validatedFields.category;
    const validatedInstrumentFile = validateWithZodSchema(imageSchema, {
      image: instrumentFile,
    });
    const instructorFile = formData.get("instructorImage") as File;
    const validatedInstructorFile = validateWithZodSchema(imageSchema, {
      image: instructorFile,
    });

    // Convert the File object to a Buffer
    const instrumentBuffer = Buffer.from(
      await validatedInstrumentFile.image.arrayBuffer()
    );
    const instructorBuffer = Buffer.from(
      await validatedInstructorFile.image.arrayBuffer()
    );

    // Upload the images to Cloudinary
    const instrumentImageUrl = await uploadImageToCloudinary(instrumentBuffer, {
      folder: "instrument_images",
      public_id: `${user.id}_${category}_image`,
    });

    const instructorImageUrl = await uploadImageToCloudinary(instructorBuffer, {
      folder: "instructors_images",
      public_id: `${user.id}_instructor`,
    });
    await db.instrument.create({
      data: {
        ...validatedFields,
        image: instrumentImageUrl,
        profileId: user.id,
        instructorImage: instructorImageUrl,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/");
};

export const fetchInstruments = async ({
  search = "",
  category,
}: {
  search?: string;
  category?: string;
}) => {
  const instruments = await db.instrument.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      image: true,
      price: true,
      instructorImage: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return instruments;
};

export const fetchFavoriteId = async ({
  instrumentId,
}: {
  instrumentId: string;
}) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      instrumentId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
  instrumentId: string;
  favoriteId: string | null;
  pathname: string;
}) => {
  const user = await getAuthUser();
  const { instrumentId, favoriteId, pathname } = prevState;
  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await db.favorite.create({
        data: {
          instrumentId,
          profileId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return {
      message: favoriteId ? "Removed from favorites" : "Added to favorites",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchFavorites = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      instrument: {
        select: {
          id: true,
          name: true,
          tagline: true,
          price: true,
          image: true,
          instructorImage: true,
        },
      },
    },
  });
  return favorites.map((favorite) => favorite.instrument);
};

export const fetchInstrumentDetails = (id: string) => {
  return db.instrument.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
    },
  });
};

export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(createReviewSchema, rawData);
    await db.review.create({
      data: {
        ...validatedFields,
        profileId: user.id,
      },
    });
    revalidatePath(`/instruments/${validatedFields.instrumentId}`);
    return { message: "Review submitted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchInstrumentReviews = async () => {
  return { message: "fetch reviews" };
};

export const fetchInstrumentReviewsByUser = async () => {
  return { message: "fetch user reviews" };
};

export const deleteReviewAction = async () => {
  return { message: "delete  reviews" };
};
