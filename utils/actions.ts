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
import { auth, clerkClient, currentUser, getAuth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageToCloudinary } from "./cloudinary";
import { error } from "console";
import { calculateTotals } from "./calculateTotals";
import { formatDate } from "./format";
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
      bookings: {
        select: {
          startTime: true,
        },
      },
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

export const fetchInstrumentReviews = async (instrumentId: string) => {
  const reviews = await db.review.findMany({
    where: {
      instrumentId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};

export const fetchInstrumentReviewsByUser = async () => {
  const user = await getAuthUser();
  const reviews = await db.review.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      instrument: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return reviews;
};

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();
  try {
    await db.review.delete({
      where: {
        id: reviewId,
        profileId: user.id,
      },
    });
    revalidatePath("/reviews");
    return { message: "Review deleted successfully" };
  } catch (error) {}
  return renderError(error);
};

export const findExistingReview = async (
  userId: string,
  instrumentId: string
) => {
  return db.review.findFirst({
    where: {
      profileId: userId,
      instrumentId: instrumentId,
    },
  });
};

export async function fetchInstrumentRating(instrumentId: string) {
  const result = await db.review.groupBy({
    by: ["instrumentId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      instrumentId,
    },
  });
  return {
    rating: result[0]?._avg.rating?.toFixed() ?? 0,
    count: result[0]?._count.rating ?? 0,
  };
}

export const createBookingAction = async (prevState: {
  instrumentId: string;
  startTime: Date;
}) => {
  const user = await getAuthUser();
  await db.booking.deleteMany({
    where: {
      profileId: user.id,
      paymentStatus: false,
    },
  });

  let bookingId: null | string = null;
  const { instrumentId, startTime } = prevState;
  const instrument = await db.instrument.findUnique({
    where: { id: instrumentId },
    select: { price: true },
  });
  if (!instrument) {
    return { message: "Instrument not found" };
  }
  const { orderTotal } = calculateTotals({ price: instrument.price });
  try {
    const booking = await db.booking.create({
      data: {
        startTime,
        orderTotal,
        profileId: user.id,
        instrumentId,
      },
    });
    bookingId = booking.id;
  } catch (error) {
    return renderError(error);
  }
  redirect(`/checkout?bookingId=${bookingId}`);
};

export const fetchBookings = async () => {
  const user = await getAuthUser();
  const bookings = await db.booking.findMany({
    where: {
      profileId: user.id,
      paymentStatus: true,
    },
    include: {
      instrument: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return bookings;
};

export const fetchBookingsTimes = async () => {
  // Fetch all bookings from the database
  const bookings = await db.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return bookings; // Returns an array of bookings with startTime
};

export async function deleteBookingAction(prevState: { bookingId: string }) {
  const { bookingId } = prevState;
  const user = await getAuthUser();

  try {
    const result = await db.booking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    });

    revalidatePath("/bookings");
    return { message: "Booking deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export const fetchClasses = async () => {
  const user = await getAuthUser();
  const classes = await db.instrument.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const classesWithBookingSums = await Promise.all(
    classes.map(async (item) => {
      const orderTotalSum = await db.booking.aggregate({
        where: {
          instrumentId: item.id,
          paymentStatus: true,
        },
        _sum: {
          orderTotal: true,
        },
      });

      return {
        ...item,
        orderTotalSum: orderTotalSum._sum.orderTotal,
      };
    })
  );
  return classesWithBookingSums;
};

export async function deleteClassAction(prevState: { instrumentId: string }) {
  const { instrumentId } = prevState;
  const user = await getAuthUser();

  try {
    await db.instrument.delete({
      where: {
        id: instrumentId,
        profileId: user.id,
      },
    });
    revalidatePath("/classes");
    return { message: "Class deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export const fetchClassDetails = async (instrumentId: string) => {
  const user = await getAuthUser();
  return db.instrument.findUnique({
    where: {
      id: instrumentId,
      profileId: user.id,
    },
  });
};

export const updateInstrumentAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const instrumentId = formData.get("id") as string;
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(instrumentSchema, rawData);
    await db.instrument.update({
      where: {
        id: instrumentId,
        profileId: user.id,
      },
      data: {
        ...validatedFields,
      },
    });
    revalidatePath(`/classes/${instrumentId}/edit`);
    return { message: "Update Successful" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateInstrumentImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const instrumentId = formData.get("id") as string;
  try {
    const instrumentFile = formData.get("instrumentUpdateImage") as File;
    const validatedInstrumentFile = validateWithZodSchema(imageSchema, {
      image: instrumentFile,
    });

    // Convert the File object to a Buffer
    const instrumentBuffer = Buffer.from(
      await validatedInstrumentFile.image.arrayBuffer()
    );

    // Upload the images to Cloudinary
    const instrumentImageUrl = await uploadImageToCloudinary(instrumentBuffer, {
      folder: "instrument_images",
      public_id: `${user.id}_image`,
    });
    await db.instrument.update({
      where: {
        id: instrumentId,
        profileId: user.id,
      },
      data: {
        image: instrumentImageUrl,
      },
    });
    revalidatePath(`/classes/${instrumentId}/edit`);
    return { message: "Property Image Updated Successful" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateInstructorImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const instrumentId = formData.get("id") as string;
  try {
    const instructorFile = formData.get("instructorUpdateImage") as File;
    const validatedInstructorFile = validateWithZodSchema(imageSchema, {
      image: instructorFile,
    });
    // Convert the File object to a Buffer
    const instructorBuffer = Buffer.from(
      await validatedInstructorFile.image.arrayBuffer()
    );
    // Upload the images to Cloudinary
    const instructorImageUrl = await uploadImageToCloudinary(instructorBuffer, {
      folder: "instructors_images",
      public_id: `${user.id}_instructor`,
    });
    await db.instrument.update({
      where: {
        id: instrumentId,
        profileId: user.id,
      },
      data: {
        instructorImage: instructorImageUrl,
      },
    });
    revalidatePath(`/classes/${instrumentId}/edit`);
    return { message: "Property Image Updated Successful" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchReservations = async () => {
  const user = await getAuthUser();
  const reservations = await db.booking.findMany({
    where: {
      paymentStatus: true,
      instrument: {
        profileId: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      instrument: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  });
  return reservations;
};

export const hoursOfBookings = async () => {
  const user = await getAuthUser();
  const hours = await db.booking.count({
    where: {
      instrument: {
        profileId: user.id,
      },
    },
  });
  return hours;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");
  return user;
};

export const fetchStats = async () => {
  const usersCount = await db.profile.count();
  const instrumentsCount = await db.instrument.count();
  const bookingsCount = await db.booking.count();

  return {
    usersCount,
    instrumentsCount,
    bookingsCount,
  };
};

export const fetchChartsData = async () => {
  await getAdminUser();
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const sixMonthsAgo = date;

  const bookings = await db.booking.findMany({
    where: {
      paymentStatus: true,
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  let bookingsPerMonth = bookings.reduce((total, current) => {
    const date = formatDate(current.createdAt, true); // farmats the current date to be displayed on year and month

    const existingEntry = total.find((entry) => entry.date === date);
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      total.push({ date, count: 1 });
    }
    return total;
  }, [] as Array<{ date: string; count: number }>);
  return bookingsPerMonth;
};

export const fetchReservationsStats = async () => {
  const user = await getAuthUser();
  const instruments = await db.instrument.count({
    where: {
      profileId: user.id,
    },
  });
  const totals = await db.booking.aggregate({
    _sum: {
      orderTotal: true,
    },
    where: {
      instrument: {
        profileId: user.id,
      },
    },
  });

  return {
    instruments,
    amount: totals._sum.orderTotal || 0,
  };
};
