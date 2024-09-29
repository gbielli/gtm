import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Header() {
  return (
    <header className="mx-auto px-4 mb-10 bg-white border border-b-gray-200">
      <div className="py-6">
        <Image
          src="/images/logo-boryl.svg"
          alt="Company Logo"
          width={300}
          height={100}
          className="h-10 w-auto mx-auto"
        />
      </div>
      <Separator className="bg-gray-100" />
    </header>
  );
}
