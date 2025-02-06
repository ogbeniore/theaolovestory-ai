import { Guest } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Table2,
} from "lucide-react";

interface RsvpStatsProps {
  guests: Guest[];
}

export default function RsvpStats({ guests }: RsvpStatsProps) {
  const totalGuests = guests.length;
  const attending = guests.filter((g) => g.isAttending).length;
  const notAttending = guests.filter((g) => g.isAttending === false).length;
  const pending = guests.filter((g) => g.isAttending === null).length;
  const withTable = guests.filter((g) => g.tableNumber !== null).length;

  const attendingPercentage = totalGuests ? (attending / totalGuests) * 100 : 0;
  const notAttendingPercentage = totalGuests ? (notAttending / totalGuests) * 100 : 0;
  const pendingPercentage = totalGuests ? (pending / totalGuests) * 100 : 0;
  const tableAssignedPercentage = totalGuests ? (withTable / totalGuests) * 100 : 0;

  const StatCard = ({
    title,
    value,
    total,
    icon: Icon,
    percentage,
  }: {
    title: string;
    value: number;
    total: number;
    icon: React.ElementType;
    percentage: number;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} / {total}
        </div>
        <Progress
          value={percentage}
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {percentage.toFixed(1)}% of total guests
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Guests"
        value={totalGuests}
        total={totalGuests}
        icon={Users}
        percentage={100}
      />
      <StatCard
        title="Attending"
        value={attending}
        total={totalGuests}
        icon={UserCheck}
        percentage={attendingPercentage}
      />
      <StatCard
        title="Not Attending"
        value={notAttending}
        total={totalGuests}
        icon={UserX}
        percentage={notAttendingPercentage}
      />
      <StatCard
        title="Pending Response"
        value={pending}
        total={totalGuests}
        icon={Clock}
        percentage={pendingPercentage}
      />
    </div>
  );
}
