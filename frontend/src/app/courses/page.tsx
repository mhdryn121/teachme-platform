"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { Search, Filter, BookOpen, Loader2 } from "lucide-react";

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail_url?: string;
    instructor_id: number;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${API_URL}/courses/`);
            if (!res.ok) throw new Error("Failed to fetch courses");
            const data = await res.json();
            setCourses(data);
        } catch (err) {
            setError("Failed to load courses. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
                            <p className="mt-2 text-gray-600">Discover new skills from expert creators.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Filter className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">{error}</div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">No courses found yet.</p>
                        <p className="text-sm mt-2">Be the first to create one!</p>
                        <Link href="/studio" className="mt-4 inline-block text-green-600 font-medium hover:underline">
                            Go to Studio
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <Link key={course.id} href={`/courses/${course.id}`} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:border-green-200">
                                <div className="h-48 bg-gray-200 relative">
                                    {course.thumbnail_url ? (
                                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            <BookOpen className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                                        ${course.price}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">{course.title}</h3>
                                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{course.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">
                                                ID
                                            </div>
                                            <span className="text-sm text-gray-600">Instructor #{course.instructor_id}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
