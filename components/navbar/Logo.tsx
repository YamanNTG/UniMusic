import { GiGrandPiano } from "react-icons/gi";
import { Button } from "../ui/button";
import Link from "next/link";

function Logo() {
  return (
    <Button asChild size="icon" className="text-4xl">
      <Link href="/">
        <GiGrandPiano />
      </Link>
    </Button>
  );
}

export default Logo;
