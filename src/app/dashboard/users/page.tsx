import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface AccountItem {
  provider: string;
}

interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  accounts: AccountItem[];
}

export default async function UsersPage() {
  // Get all users from SQLite and show the newest account first
  const users: UserItem[] = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      accounts: {
        select: {
          provider: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Count how many users joined with Google or email
  const totalUsers = users.length;
  const googleUsers = users.filter((u: UserItem) =>
    u.accounts.some((a: AccountItem) => a.provider === "google")
  ).length;
  const emailUsers = totalUsers - googleUsers;

  return (
    <main className="min-h-screen bg-gray-50/60 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Admin Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
              Registered Users
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              បញ្ជីឈ្មោះអ្នកប្រើប្រាស់ដែលបានចុះឈ្មោះក្នុង SQLite Database (dev.db)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              + Create New User
            </Link>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Total Users */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">អ្នកប្រើសរុប (Total)</span>
              <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                👥
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-gray-900">{totalUsers}</p>
            <p className="mt-1 text-xs text-gray-500">All registered accounts</p>
          </div>

          {/* Google Users */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Google Login</span>
              <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center font-bold">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-gray-900">{googleUsers}</p>
            <p className="mt-1 text-xs text-gray-500">Connected via Google OAuth</p>
          </div>

          {/* Email / Password Users */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Email & Password</span>
              <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                ✉️
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-gray-900">{emailUsers}</p>
            <p className="mt-1 text-xs text-gray-500">Credentials hashed with bcrypt</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              User List ({totalUsers})
            </h2>
            <span className="text-xs text-gray-500">Synced live from dev.db</span>
          </div>

          {users.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 text-4xl mb-3">📭</div>
              <h3 className="text-base font-semibold text-gray-900">មិនទាន់មាន User នៅក្នុង Database ទេ</h3>
              <p className="mt-1 text-sm text-gray-500">
                សូមចូលទៅកាន់ទំព័រ Signup ឬ Login with Google ដើម្បីបង្កើត User ដំបូងរបស់អ្នក។
              </p>
              <div className="mt-6">
                <Link
                  href="/signup"
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Go to Signup Page
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/75 text-xs uppercase text-gray-500 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 font-semibold">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">
                      Sign-in Method
                    </th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">
                      Registered Date
                    </th>
                    <th scope="col" className="px-6 py-3.5 font-semibold text-right">
                      User ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user: UserItem) => {
                    const isGoogle = user.accounts.some(
                      (acc: AccountItem) => acc.provider === "google"
                    );

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        {/* Avatar & Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.name || "Unnamed User"}
                              </div>
                              <div className="text-xs text-gray-400">
                                Member
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-700">
                          {user.email || "No email"}
                        </td>

                        {/* Auth Provider */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isGoogle ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-200/60">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                              Google OAuth
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 border border-purple-200/60">
                              <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                              Email & Password
                            </span>
                          )}
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        {/* User ID */}
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-xs text-gray-400">
                          {user.id.slice(0, 10)}...
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
