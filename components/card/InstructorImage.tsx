import { LuUser2 } from "react-icons/lu";
import { fetchProfileImage } from "@/utils/actions";
async function InstructorImage({ profileId }: { profileId: string }) {
  const profileImage = await fetchProfileImage();

  if (profileImage)
    return (
      <img
        src={profileImage}
        className="w-[100px] h-[100px] rounded object-cover"
      />
    );

  return <LuUser2 className="w-20 h-20 bg-primary rounded text-white" />;
}

export default InstructorImage;
