import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div 
        className="h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1503455637927-730bce8583c0")',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 py-32 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-100 to-white text-transparent bg-clip-text">
            Sarah & Michael
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-rose-100">
            Join us in celebrating our special day
          </p>
          <p className="text-xl mb-12">
            September 15th, 2024 • The Grand Plaza • New York
          </p>
          <div className="space-x-4">
            <Button
              asChild
              size="lg"
              className="bg-rose-500 hover:bg-rose-600"
            >
              <Link href="/rsvp">RSVP Now</Link>
            </Button>
            {user?.isAdmin && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-rose-300 text-rose-100 hover:bg-rose-500/20"
              >
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
