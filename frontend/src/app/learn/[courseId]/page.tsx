"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL, BASE_URL } from "@/lib/api";
import Link from "next/link";
import { PlayCircle, CheckCircle, Lock, Menu, ArrowLeft, Loader2, ChevronDown, ChevronRight } from "lucide-react";

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
    modules: Module[];
}

export default function ClassroomPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);

    useEffect(() => {
        if (params.courseId) {
            fetchCourse(params.courseId as string);
        }
    }, [params.courseId]);

    const fetchCourse = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/courses/${id}`);
            if (!res.ok) throw new Error("Course not found");
            const data = await res.json();
            setCourse(data);

            // Auto-select first video
            if (data.modules.length > 0 && data.modules[0].videos.length > 0) {
                setActiveVideo(data.modules[0].videos[0]);
                setExpandedModules([data.modules[0].id]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleModule = (moduleId: number) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
    );

    if (!course) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            {/* Classroom Header */}
            <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href="/profile" className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <h1 className="text-lg font-semibold truncate max-w-md">{course.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">Progress: 0%</div>
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-0"></div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content: Video Player */}
                <main className="flex-1 overflow-y-auto bg-black flex flex-col">
                    {activeVideo ? (
                        <div className="flex-1 flex items-center justify-center bg-black relative">
                            {/* In a real app, use a proper video player component */}
                            <video
                                controls
                                className="w-full max-h-full aspect-video"
                                src={activeVideo.url.startsWith("http") ? activeVideo.url : `${BASE_URL}${activeVideo.url}`}
                                poster="/placeholder-video.jpg"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a lesson to start watching
                        </div>
                    )}

                    {activeVideo && (
                        <div className="p-8 bg-gray-900">
                            <h2 className="text-2xl font-bold mb-4">{activeVideo.title}</h2>
                            <p className="text-gray-400">
                                This is where the lesson description and resources would go.
                            </p>
                        </div>
                    )}
                </main>

                {/* Sidebar: Curriculum */}
                <aside className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto hidden lg:block">
                    <div className="p-4 border-b border-gray-700">
                        <h3 className="font-bold text-gray-300">Course Content</h3>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {course.modules.map((module) => (
                            <div key={module.id}>
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors text-left"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-gray-200">{module.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{module.videos.length} lessons</p>
                                    </div>
                                    {expandedModules.includes(module.id) ? (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>

                                {expandedModules.includes(module.id) && (
                                    <div className="bg-gray-900/50">
                                        {module.videos.map((video) => (
                                            <button
                                                key={video.id}
                                                onClick={() => setActiveVideo(video)}
                                                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors border-l-2 ${activeVideo?.id === video.id
                                                    ? "bg-gray-800 border-green-500 text-green-400"
                                                    : "border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                                    }`}
                                            >
                                                <div className="mt-0.5">
                                                    {activeVideo?.id === video.id ? (
                                                        <PlayCircle className="w-4 h-4" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border border-gray-600" />
                                                    )}
                                                </div>
                                                <span className="text-sm">{video.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
