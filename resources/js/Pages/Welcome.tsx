import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }: PageProps<{}>) {
    return (
        <>
            <Head title="Welcome">
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-white font-[Inter]">
                <header className="fixed w-full bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex-shrink-0">
                                <Link href="/">
                                    <ApplicationLogo className="h-8 w-auto" />
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                            {auth.user && auth?.user?.permissions?.includes('can view dashboard') ? (
                                <Link
                                    prefetch
                                    href={route('dashboard')}
                                    className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    prefetch
                                    href={route('login')}
                                    className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                                >
                                    Login
                                </Link>
                            )}

                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <h1 className="text-[2.75rem] font-semibold leading-2 tracking-tight text-gray-900 sm:text-5xl md:text-6xl ">
                            Learning Management System{' '}
                            <span className="block">Admin Panel</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
                            Manage your courses, students, and instructors all in one place. 
                            Access comprehensive analytics and reporting to track learning progress.
                        </p>
                        <div className="mt-10">
                            <Link
                                prefetch
                                href={route('login')}
                                className="rounded-full bg-black px-8 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </main>

                <footer className="fixed bottom-0 w-full bg-white py-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} Learning Management System. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
