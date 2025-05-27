import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Truck, Award, TrendingUp } from "lucide-react";
import type { UserImpact } from "@/lib/types";

export default function ImpactStats() {
  const { data: impact } = useQuery<UserImpact>({
    queryKey: ["/api/impact"],
  });

  const stats = [
    {
      icon: Heart,
      label: "Meals Donated",
      value: impact?.mealsDonated || 0,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Truck,
      label: "Deliveries Completed",
      value: impact?.deliveriesCompleted || 0,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: TrendingUp,
      label: "Meals Distributed",
      value: impact?.mealsDistributed || 0,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Award,
      label: "Points Earned",
      value: impact?.points || 0,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
