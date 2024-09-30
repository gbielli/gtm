import { Badge } from "@/components/ui/badge";
import { LineChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="hidden border-r bg-white md:block ">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-18 items-center border-b px-4 lg:h-[75px] lg:px-6 py-4 ">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/images/logo-boryl.svg"
              alt="Company Logo"
              width={300}
              height={100}
              className="h-8 w-auto mx-auto"
            />
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start  px-2 py-2 text-sm font-medium lg:px-4">
            <Link
              href="#"
              className="flex items-center gap-3 bg-muted rounded-lg px-3 py-3 text-primary transition-all"
            >
              <LineChart className="h-4 w-4" />
              Facebook
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all"
            >
              <LineChart className="h-4 w-4" />
              Tiktok
              <Badge className="ml-auto flex h-6 shrink-0 items-center justify-center rounded-full">
                coming soon
              </Badge>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all"
            >
              <LineChart className="h-4 w-4" />
              Linkedin
              <Badge className="ml-auto flex h-6 shrink-0 items-center justify-center rounded-full">
                coming soon
              </Badge>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
