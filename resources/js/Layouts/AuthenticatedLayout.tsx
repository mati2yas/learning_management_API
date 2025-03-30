"use client"

import { type PropsWithChildren, type ReactNode, useState, useEffect } from "react"
import { Link, usePage } from "@inertiajs/react"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  FileText,
  BookCopy,
  CreditCard,
  Users,
  UserCog,
  User,
  LogOut,
  Menu,
} from "lucide-react"
import ApplicationLogo from "@/Components/ApplicationLogo"
import ResponsiveNavLink from "@/Components/ResponsiveNavLink"

export default function Authenticated({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { auth } = usePage().props as unknown as {
    auth: { user: { name: string; email: string; permissions: string[] } | null }
  }


  // Handle window resize to automatically collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen)
  }

  // Function to check if a route is active, including related routes for courses
  const isRouteActive = (routeName: string) => {
    // Exact match for most routes
    if (route().current(routeName)) {
      return true
    }

    // For courses, also check related routes
    if (routeName === "courses.index") {
      // Check if current URL contains these patterns
      const currentUrl = window.location.pathname
      const relatedPatterns = ["/chapters/", "/quizzes/", "/contents/", "/courses/"]

      return relatedPatterns.some((pattern) => currentUrl.includes(pattern))
    }

    if (routeName === "exams-new.index") {
        // Check if current URL contains these patterns
        const currentUrl = window.location.pathname
        const relatedPatterns = [ "/exam-details/", "/exams-new/"]
  
        return relatedPatterns.some((pattern) => currentUrl.includes(pattern))
      }

    return false
  }

  const navItems = [
    {
      name: "Dashboard",
      route: "dashboard",
      permission: "can view dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Courses",
      route: "courses.index",
      permission: "can view courses",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Exams",
      route: "exams-new.index",
      permission: "can view exams",
      icon: <FileText size={20} />,
    },
    {
      name: "Exam Courses",
      route: "exam-courses.index",
      permission: "can view exam courses",
      icon: <BookCopy size={20} />,
    },
    {
      name: "Subscriptions",
      route: "subscriptions.index",
      permission: "can view subscription",
      icon: <CreditCard size={20} />,
    },
    {
      name: "Students Management",
      route: "student-managements.index",
      permission: "can view students management",
      icon: <Users size={20} />,
    },
    {
      name: "Workers Management",
      route: "user-managements.index",
      permission: "can view workers management",
      icon: <UserCog size={20} />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 right-4 z-50 rounded-md bg-white p-2 shadow-md lg:hidden"
        aria-label="Toggle mobile menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 hidden h-full flex-col bg-white shadow-lg transition-all duration-300 lg:flex ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className={`flex items-center ${collapsed ? "justify-center w-full" : ""}`}>
            <ApplicationLogo className="h-9 w-auto fill-current text-gray-800" />
            {!collapsed && <span className="ml-2 text-xl font-semibold">Admin</span>}
          </div>
          <button
            onClick={toggleSidebar}
            className={`rounded-full p-1 text-gray-500 hover:bg-gray-100 ${collapsed ? "hidden" : ""}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={20} />
          </button>
          {collapsed && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-20 rounded-full bg-white p-1 text-gray-500 shadow-md hover:bg-gray-100"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <nav className="flex-1 space-y-1 px-2">
            {navItems.map(
              (item) =>
                auth?.user?.permissions?.includes(item.permission) && (
                  <Link
                    key={item.route}
                    href={route(item.route)}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isRouteActive(item.route)
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <div
                      className={`${
                        isRouteActive(item.route) ? "text-indigo-700" : "text-gray-500"
                      } group-hover:text-gray-900`}
                    >
                      {item.icon}
                    </div>
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                ),
            )}
          </nav>
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className={`flex items-center ${collapsed ? "justify-center" : ""}`}>
            {!collapsed && (
              <div className="flex-shrink-0">
                <div className="text-sm font-medium text-gray-700">{auth.user?.name}</div>
                <div className="text-xs text-gray-500 truncate">{auth.user?.email}</div>
              </div>
            )}
            <div className={`flex ${collapsed ? "flex-col" : "ml-auto"} space-y-1 ${collapsed ? "" : "space-x-2"}`}>
              <Link
                href={route("profile.edit")}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Profile"
              >
                <User size={collapsed ? 20 : 16} />
              </Link>
              <Link
                href={route("logout")}
                method="post"
                as="button"
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Log out"
              >
                <LogOut size={collapsed ? 20 : 16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Slide-over) */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-full w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={toggleMobileMenu}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-shrink-0 items-center px-4">
            <ApplicationLogo className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold">Admin</span>
          </div>

          <div className="mt-5 flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2">
              {navItems.map(
                (item) =>
                  auth?.user?.permissions?.includes(item.permission) && (
                    <ResponsiveNavLink
                      key={item.route}
                      href={route(item.route)}
                      active={isRouteActive(item.route)}
                      className="flex items-center"
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </ResponsiveNavLink>
                  ),
              )}
            </nav>
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-700">{auth.user?.name}</div>
              <div className="text-xs text-gray-500">{auth.user?.email}</div>
              <div className="mt-3 space-y-1">
                <ResponsiveNavLink href={route("profile.edit")}>Profile</ResponsiveNavLink>
                <ResponsiveNavLink method="post" href={route("logout")} as="button">
                  Log Out
                </ResponsiveNavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="w-14 flex-shrink-0" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" onClick={toggleMobileMenu}></div>
      )}

      {/* Fixed Header */}
      {header && (
        <header
          className={`fixed top-0 right-0 z-20 bg-white shadow transition-all duration-300 ${
            collapsed ? "lg:left-20" : "lg:left-64"
          } left-0`}
        >
          <div className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6 lg:px-8">{header}</div>
        </header>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        } ${header ? "pt-24" : ""}`}
      >
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

