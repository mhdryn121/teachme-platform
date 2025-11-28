"use client";

import { useState } from "react";
import { VideoUploader } from "@/components/VideoUploader";
import { Plus, Save, ChevronRight } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function CreateCoursePage() {
    const [step, setStep] = useState(1);
    const [courseId, setCourseId] = useState<number | null>(null);
    const [modules, setModules] = useState<any[]>([]);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const createCourse = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to create a course");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/courses/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, price: 0, is_published: false }),
            });

            if (!res.ok) {
                throw new Error("Failed to create course");
            }

            const data = await res.json();
            setCourseId(data.id);
            setStep(2);
        } catch (err) {
            console.error("Failed to create course", err);
            alert("Failed to create course. Please try again.");
        }
    };

    const createModule = async () => {
        if (!courseId) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/courses/${courseId}/modules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title: `Module ${modules.length + 1}` }),
            });

            if (!res.ok) {
                throw new Error("Failed to create module");
            }

            const data = await res.json();
            setModules([...modules, data]);
        } catch (err) {
            console.error("Failed to create module", err);
            alert("Failed to create module.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className={step >= 1 ? "text-blue-600 font-medium" : ""}>1. Course Details</span>
                <ChevronRight className="w-4 h-4" />
                <span className={step >= 2 ? "text-blue-600 font-medium" : ""}>2. Curriculum</span>
            </div>

            {step === 1 && (
                <div className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Course Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="e.g. Advanced Python Masterclass"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-gray-900"
                            placeholder="What will students learn?"
                        />
                    </div>

                    <button
                        onClick={createCourse}
                        disabled={!title}
                        className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        Save & Continue
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Curriculum</h1>
                        <button
                            onClick={createModule}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                        >
                            <Plus className="w-4 h-4" />
                            Add Module
                        </button>
                    </div>

                    <div className="space-y-4">
                        {modules.map((module) => (
                            <div key={module.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <h3 className="font-semibold text-gray-900">{module.title}</h3>

                                <VideoUploader
                                    moduleId={module.id}
                                    onUploadComplete={(video) => {
                                        console.log("Video uploaded:", video);
                                        alert(`Uploaded: ${video.title}`);
                                    }}
                                />
                            </div>
                        ))}

                        {modules.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">No modules yet. Click "Add Module" to start.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
