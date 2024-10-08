import * as z from "zod";
import { ZodSchema } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(5, { message: "First name must be at least 5 characters long" }),
  lastName: z
    .string()
    .min(5, { message: "Last name must be at least 5 characters long" }),
  username: z
    .string()
    .min(5, { message: "Username name must be at least 5 characters long" }),
});

export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);

    throw new Error(errors.join(", "));
  }
  return result.data;
}

export const imageSchema = z.object({
  image: validateFile(),
});

function validateFile() {
  const maxUploadSize = 2048 * 2048;
  const acceptedFileTypes = ["image/"];
  return z.z
    .custom<File>()
    .refine((file) => {
      return !file || file.size <= maxUploadSize;
    }, `File size must be less than 2 MB`)
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      );
    }, "File must be an image");
}

export const instrumentSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(100, {
      message: "name must be less than 100 characters.",
    }),
  tagline: z
    .string()
    .min(2, {
      message: "tagline must be at least 2 characters.",
    })
    .max(100, {
      message: "tagline must be less than 100 characters.",
    }),
  price: z.coerce.number().int().min(0, {
    message: "price must be a positive number.",
  }),
  category: z.string(),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(" ").length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: "description must be between 10 and 1000 words.",
    }
  ),
});

export const createReviewSchema = z.object({
  instrumentId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
});
