import Image from "next/image";

type UserInfoProps = {
  profile: {
    instructorImage: string;
    firstName: string;
  };
};

function UserInfo({ profile: { instructorImage, firstName } }: UserInfoProps) {
  return (
    <article className="grid grid-cols-[auto,1fr] gap-4 mt-4">
      <Image
        src={instructorImage}
        alt={firstName}
        width={100}
        height={100}
        className="rounded-md w-[100px] h-[100px] object-cover"
      />
      <div>
        <p>
          Class Hosted by <span className="font-bold">{firstName}</span>
        </p>
        <p>SuperTeacher &middot; 2 years teaching</p>
      </div>
    </article>
  );
}

export default UserInfo;
