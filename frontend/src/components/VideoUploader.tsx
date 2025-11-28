"use client";

import { useState } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_URL } from "@/lib/api";

interface VideoUploaderProps {
    moduleId: number;
    onUploadComplete: (video: any) => void;
}

export function VideoUploader({ moduleId, onUploadComplete }: VideoUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await uploadFile(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await uploadFile(e.target.files[0]);
        }
    };

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith("video/")) {
            setError("Please upload a valid video file.");
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please log in to upload videos.");
            setIsUploading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/courses/${moduleId}/videos`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onUploadComplete(data);
        } catch (err) {
            setError("Failed to upload video. Please try again.");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            className={twMerge(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
                isUploading && "opacity-50 cursor-not-allowed"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="video/*"
                className="hidden"
                id={`video-upload-${moduleId}`}
                onChange={handleFileSelect}
                disabled={isUploading}
            />
            <label htmlFor={`video-upload-${moduleId}`} className="cursor-pointer block w-full h-full">
                <div className="flex flex-col items-center justify-center gap-2">
                    {isUploading ? (
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    ) : (
                        <Upload className="w-10 h-10 text-gray-400" />
                    )}
                    <p className="text-sm font-medium text-gray-700">
                        {isUploading ? "Uploading..." : "Drag & drop video or click to browse"}
                    </p>
                    <p className="text-xs text-gray-500">MP4, MOV, WebM up to 2GB</p>
                </div>
            </label>

            {error && (
                <div className="mt-4 flex items-center justify-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
