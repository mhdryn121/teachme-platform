"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye, EyeOff, Plus } from "lucide-react";
import { VideoUploader } from "@/components/VideoUploader";
import { API_URL } from "@/lib/api";

interface Video {
    id: number;
    title: string;
    url: string;
}

interface Module {
    id: number;
    title: string;
    videos: Video[];
}

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    is_published: boolean;
    modules: Module[];
}

export default function CourseEditorPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        if (params.courseId) {
            fetchCourse(params.courseId as string);
        }
    }, [params.courseId]);

    const fetchCourse = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/courses/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCourse(data);
                setTitle(data.title);
                setDescription(data.description || "");
                setPrice(data.price);
                setIsPublished(data.is_published);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const createModule = async () => {
        if (!course) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/courses/${course.id}/modules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title: `Module ${(course.modules?.length || 0) + 1}` }),
            });

            if (res.ok) {
                // Refresh course to show new module
                fetchCourse(course.id.toString());
            } else {
                throw new Error("Failed to create module");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create module.");
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        if (!token || !course) return;

        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/courses/${course.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    price,
                    is_published: isPublished
                })
            });

            if (res.ok) {
                const updatedCourse = await res.json();
                setCourse(updatedCourse);
                alert("Course updated successfully!");
            } else {
                throw new Error("Failed to update course");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
    );

    if (!course) return <div>Course not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/studio" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
                        <p className="text-sm text-gray-500">Manage your course content and settings.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPublished(!isPublished)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isPublished
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent max-w-xs text-gray-900"
                        />
                    </div>
                </div>
            </div>

            {/* Curriculum Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Curriculum</h2>
                    <button
                        onClick={createModule}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Module
                    </button>
                </div>

                <div className="space-y-4">
                    {course.modules && course.modules.map((module: any) => (
                        <div key={module.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">{module.videos?.length || 0} videos</span>
                                </div>
                            </div>

                            {/* Video List */}
                            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                                {module.videos && module.videos.map((video: any) => (
                                    <div key={video.id} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                                                {video.id}
                                            </div>
                                            {video.title}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <VideoUploader
                                    moduleId={module.id}
                                    onUploadComplete={(video) => {
                                        console.log("Video uploaded:", video);
                                        // Refresh course data to show new video
                                        fetchCourse(course.id.toString());
                                    }}
                                />
                            </div>
                        </div>
                    ))}

                    {(!course.modules || course.modules.length === 0) && (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p>No modules yet. Click "Add Module" to start building your curriculum.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
