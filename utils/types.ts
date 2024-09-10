export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string }>;

export type CloudinaryUploadOptions = {
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: "image" | "video" | "raw" | "auto";
  transformation?: object | string;
};

export type InstrumentCardProps = {
  image: string;
  id: string;
  name: string;
  tagline: string;
  price: number;
  instructorImage: string;
};

export type Booking = {
  startTime: Date;
};
