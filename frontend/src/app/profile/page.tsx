"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, MapPin, Globe, Calendar, Hash, LogOut, BookOpen, ArrowRight } from "lucide-react";
import { API_URL } from "@/lib/api";

interface UserProfile {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
    address: string;
    country: string;
    date_of_birth: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        fetchUser(token);
        fetchEnrollments(token);
    }, [router]);

    const fetchUser = async (token: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else if (res.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
            } else {
                setError("Failed to load profile");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEnrollments = async (token: string) => {
        try {
            const res = await fetch(`${API_URL}/enrollments/my-courses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setEnrollments(data);
            }
        } catch (err) {
            console.error("Failed to fetch enrollments", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-green-600 hover:underline"
                >
                    Retry
                </button>
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-xl font-bold text-gray-900 tracking-tight">TeachMe</span>
                            </Link>
                            <div className="hidden md:flex items-center gap-6">
                                <Link href="/courses" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                    Browse Courses
                                </Link>
                                <Link href="/studio" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                    Creator Studio
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white text-center">
                                <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-green-600 text-3xl font-bold mx-auto shadow-lg">
                                    {user.first_name?.[0]}{user.last_name?.[0]}
                                </div>
                                <h2 className="mt-4 text-xl font-bold">{user.first_name} {user.last_name}</h2>
                                <p className="text-green-100 font-medium">@{user.username}</p>
                                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                    <Hash className="w-3 h-3" />
                                    <span>TMS-{String(user.id).padStart(6, '0')}</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{user.phone_number}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{user.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{user.country}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{user.date_of_birth}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dashboard Actions */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Welcome Section */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.first_name}! 👋</h1>
                            <p className="text-gray-600 mt-1">Ready to learn something new or share your knowledge?</p>
                        </div>

                        {/* My Learning Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-gray-900">My Learning</h2>
                            {enrollments.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {enrollments.map((course) => (
                                        <Link key={course.id} href={`/learn/${course.id}`} className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200 block">
                                            <div className="absolute top-6 right-6 bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                <BookOpen className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{course.description}</p>
                                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600">
                                                Continue Learning <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                        <BookOpen className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
                                        <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                                    </div>
                                    <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                        Browse Courses
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity / Stats Placeholder */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Activity</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-gray-900">{enrollments.length}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Enrolled</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-gray-900">0</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Completed</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-gray-900">0</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Created</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-gray-900">0</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Students</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
