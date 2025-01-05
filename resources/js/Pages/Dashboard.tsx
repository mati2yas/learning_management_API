import { CircularChart } from '@/Components/CircularChart';
import { DashboardCards } from '@/Components/dashboard-cards';
import { PieChartDemo } from '@/Components/PieChartDemo';
import { Revenue } from '@/Components/Revenue';
import { Button } from '@/Components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {

    const totalUsers = 1234;
    const pendingPayments = 56;
    const isPendingPayments = true;

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                    </h2>
                    <Button>Add Course</Button>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 grid grid-cols-3 gap-3">
                          
                            <CircularChart />
                            <PieChartDemo />
                            <Revenue />
                            
                        </div>

                        <div className='p-6'>
                            <DashboardCards
                                totalUsers={totalUsers}
                                pendingItems={pendingPayments}
                                isPendingPayments={isPendingPayments}
                                onViewPendingItems={() => {}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

