import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Countdown from "@/components/Countdown";

export default function HomePage() {
  const { user } = useAuth();
  const weddingDate = new Date("2024-09-15");

  return (
    <div className="min-h-screen bg-black">
      <nav className="absolute top-4 right-4 flex items-center gap-4 text-white/60">
        <span>{weddingDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        {user?.isAdmin && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white"
          >
            <Link href="/admin">Admin</Link>
          </Button>
        )}
      </nav>

      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <h1 className="font-serif text-7xl md:text-9xl tracking-wider text-white mb-8">
            AMAKA
            <br />
            <span className="inline-block mt-4 text-8xl md:text-[10rem]">&</span>
            <br />
            OREOLUWA
          </h1>

          <div className="mt-8 mb-12">
            <Countdown targetDate={weddingDate} />
          </div>

          <div className="mt-12 space-y-4">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10 px-8"
            >
              <Link href="/rsvp">RSVP</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}