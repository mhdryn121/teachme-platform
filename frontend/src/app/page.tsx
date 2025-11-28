"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Video, MessageSquare, Sparkles, CheckCircle, User as UserIcon } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleMakeCourse = () => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/studio");
    } else {
      router.push("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">TeachMe</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    router.refresh();
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30 mix-blend-multiply animate-blob"></div>
          <div className="absolute top-40 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 mix-blend-multiply animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-8 border border-green-100">
            <CheckCircle className="w-4 h-4" />
            <span>The #1 AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
            Master Any Skill with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
              Intelligent Tutoring
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience the next generation of learning. Interactive courses, real-time AI guidance, and a vibrant community of creators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleMakeCourse}
              className="px-8 py-4 text-lg font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200/50 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Make your course
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="/courses"
              className="px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-100 rounded-full hover:border-green-200 hover:bg-green-50 transition-all w-full sm:w-auto justify-center flex"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-100 transition-colors group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                <Video className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Video</h3>
              <p className="text-gray-500 leading-relaxed">
                High-quality video lessons with smart chapters and progress tracking.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-100 transition-colors group">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                <MessageSquare className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Tutor</h3>
              <p className="text-gray-500 leading-relaxed">
                Get instant answers to your questions while you watch. Powered by OpenAI.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-100 transition-colors group">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
                <BookOpen className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Chat</h3>
              <p className="text-gray-500 leading-relaxed">
                Connect with other students and instructors in live learning rooms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-blue-900/20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start learning?</h2>
          <p className="text-gray-300 mb-10 text-lg">
            Join thousands of students and instructors on the platform today.
          </p>
          <Link
            href="/signup"
            className="px-10 py-4 text-lg font-bold text-green-900 bg-green-400 rounded-full hover:bg-green-300 transition-colors shadow-lg shadow-green-900/20"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          © 2025 TeachMe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
