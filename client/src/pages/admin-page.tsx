import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Guest } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestListTable from "@/components/GuestListTable";
import CsvUpload from "@/components/CsvUpload";
import RsvpStats from "@/components/RsvpStats";
import { Link } from "wouter";

export default function AdminPage() {
  const { logoutMutation } = useAuth();
  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ["/api/guests"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-rose-600">
          Wedding Admin
        </Link>
        <Button onClick={() => logoutMutation.mutate()} variant="ghost">
          Logout
        </Button>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <RsvpStats guests={guests} />

        <Tabs defaultValue="guests" className="mt-8">
          <TabsList>
            <TabsTrigger value="guests">Guest List</TabsTrigger>
            <TabsTrigger value="import">Import Guests</TabsTrigger>
          </TabsList>

          <TabsContent value="guests">
            <GuestListTable guests={guests} />
          </TabsContent>

          <TabsContent value="import">
            <CsvUpload />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
