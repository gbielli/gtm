import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LineChart, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header({ title }) {
  return (
    <header className="flex h-14 items-center gap-4 px-4 lg:h-[75px] lg:px-10">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src="/images/logo-boryl.svg"
                alt="Company Logo"
                width={300}
                height={100}
                className="h-8 w-auto mx-auto"
              />
              <span className="sr-only">Boryl</span>
            </Link>
            <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-3 text-foreground"
            >
              <LineChart className="h-5 w-5" />
              Facebook
            </Link>
            <Link
              href="/variables"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground"
            >
              <LineChart className="h-5 w-5" />
              Générateur variables
            </Link>
            <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground"
            >
              <LineChart className="h-5 w-5" />
              Linkedin
              <Badge className="ml-auto flex h-6 shrink-0 items-center justify-center rounded-full">
                coming soon
              </Badge>
            </Link>
          </nav>
          <div className="mt-auto"></div>
        </SheetContent>
      </Sheet>
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
    </header>
  );
}
