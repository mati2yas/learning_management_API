import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Users, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, actionLabel, onAction }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">{description+ ''}</p>
    </CardContent>
    {actionLabel && (
      <CardFooter>
        <Link prefetch href={route('subscriptions.index')} className="text-sm text-black">
                  <Button variant="outline" size="sm" className="w-full" onClick={onAction}>
          {actionLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        </Link>
      </CardFooter>
    )}
  </Card>
);

interface DashboardCardsProps {
  totalUsers: number;
  pendingItems: number;
  isPendingPayments: boolean;
  onViewPendingItems: () => void;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ 
  totalUsers, 
  pendingItems, 
  isPendingPayments, 
  onViewPendingItems 
}) => {
  return (

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Users"
        value={totalUsers}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Active users on the platform"
      />
      <StatCard
        title={isPendingPayments ? "Pending Payments" : "Pending Submissions"}
        value={pendingItems}
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        description={isPendingPayments ? "Payments awaiting processing" : "Submissions awaiting review"}
        actionLabel={"View Pending Payments"}
        // onAction={onViewPendingItems}
      />
    </div>
  );
};

