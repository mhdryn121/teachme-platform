"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Course {
    id: number;
    title: string;
    is_published: boolean;
    price: number;
    created_at: string;
}

export default function StudioPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/courses/my-courses`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCourses(data);
            }
        } catch (err) {
            console.error("Failed to fetch courses", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Creator Dashboard</h2>
                    <p className="text-gray-500 mt-1">Manage your courses and view performance.</p>
                </div>
                <Link
                    href="/studio/course/create"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Create New Course
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">$0.00</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Active Courses</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{courses.filter(c => c.is_published).length}</p>
                </div>
            </div>

            {/* Course List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Your Courses</h3>
                </div>

                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                ) : courses.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>You haven't created any courses yet.</p>
                        <Link href="/studio/course/create" className="text-green-600 hover:underline mt-2 inline-block">
                            Get started
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {courses.map((course) => (
                            <div key={course.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-medium text-gray-900 text-lg">{course.title}</h4>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${course.is_published
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                            {course.is_published ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                        <span>${course.price}</span>
                                        <span>•</span>
                                        <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/studio/course/${course.id}`}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Edit Course"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
