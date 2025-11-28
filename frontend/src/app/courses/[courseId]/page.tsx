"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { PlayCircle, CheckCircle, Lock, BookOpen, Clock, User, ArrowLeft, Loader2, Globe } from "lucide-react";

interface Video {
    id: number;
    title: string;
    url: string;
}

interface Module {
    id: number;
    title: string;
    description: string;
    videos: Video[];
}

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    instructor_id: number;
    modules: Module[];
}

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.courseId) {
            fetchCourse(params.courseId as string);
        }
    }, [params.courseId]);

    const handleEnroll = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        setIsEnrolling(true);
        try {
            // For now, we use direct enrollment (Free/Mock)
            const res = await fetch(`${API_URL}/enrollments/${course?.id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                // Redirect to classroom
                router.push(`/learn/${course?.id}`);
            } else {
                const data = await res.json();
                if (data.message === "Already enrolled") {
                    router.push(`/learn/${course?.id}`);
                } else {
                    throw new Error("Failed to enroll");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Failed to enroll. Please try again.");
        } finally {
            setIsEnrolling(false);
        }
    };

    const fetchCourse = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/courses/${id}`);
            if (!res.ok) throw new Error("Course not found");
            const data = await res.json();
            setCourse(data);
        } catch (err) {
            setError("Failed to load course details.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
    );

    if (error || !course) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Course Not Found</h2>
                <Link href="/courses" className="mt-4 inline-flex items-center text-green-600 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/courses" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
                    </Link>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-6">
                            <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
                            <p className="text-xl text-gray-300 leading-relaxed">{course.description}</p>
                            <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Instructor #{course.instructor_id}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Last updated recently
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    English
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content: Curriculum */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                            <div className="space-y-4">
                                {course.modules.length === 0 ? (
                                    <p className="text-gray-500 italic">No modules added yet.</p>
                                ) : (
                                    course.modules.map((module) => (
                                        <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {module.videos.map((video) => (
                                                    <div key={video.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3 text-gray-700">
                                                            <PlayCircle className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm font-medium">{video.title}</span>
                                                        </div>
                                                        <Lock className="w-3 h-3 text-gray-300" />
                                                    </div>
                                                ))}
                                                {module.videos.length === 0 && (
                                                    <div className="px-6 py-3 text-sm text-gray-400 italic">No videos in this module</div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Enrollment Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-gray-400" />
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                                        <span className="text-gray-500 text-sm">USD</span>
                                    </div>

                                    <button
                                        onClick={handleEnroll}
                                        disabled={isEnrolling}
                                        className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isEnrolling ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Enroll Now"
                                        )}
                                    </button>

                                    <p className="text-xs text-center text-gray-500">
                                        30-Day Money-Back Guarantee
                                    </p>

                                    <div className="space-y-3 pt-6 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>Full lifetime access</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>Access on mobile and TV</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>Certificate of completion</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
