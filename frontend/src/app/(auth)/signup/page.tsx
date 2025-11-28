"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, User, Phone, MapPin, AtSign } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        username: "",
        phone_number: "",
        address: "",
        country: "",
        date_of_birth: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password: string) => {
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        return password.length >= 8 && hasLetters && hasNumbers;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!validatePassword(formData.password)) {
            setError("Password must be at least 8 characters long and contain both letters and numbers.");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Signup
            const signupRes = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!signupRes.ok) {
                const data = await signupRes.json();
                throw new Error(data.detail || "Signup failed");
            }

            // 2. Auto-login
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            if (!loginRes.ok) {
                throw new Error("Signup successful, but auto-login failed. Please sign in manually.");
            }

            const loginData = await loginRes.json();
            localStorage.setItem("token", loginData.access_token);

            // 3. Redirect to Profile
            router.push("/profile");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Home Link */}
            <div className="absolute top-6 left-6">
                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2">
                    ← Back to Home
                </Link>
            </div>

            <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your profile
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            sign in to existing account
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-amber-800 mb-1">First Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    name="first_name"
                                    type="text"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-sky-50 text-black"
                                    placeholder="First Name"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-amber-800 mb-1">Last Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    name="last_name"
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-sky-50 text-black"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-amber-800 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-sky-50 text-black"
                                    placeholder="Email Address"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-amber-800 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    name="phone_number"
                                    type="tel"
                                    required
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-sky-50 text-black"
                                    placeholder="Phone Number"
                                />
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-amber-800 mb-1">Username</label>
                            <div className="relative">
                                <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-sky-50 text-black"
                                    placeholder="Username"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-amber-800 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-black"
                                    placeholder="Min 8 chars, letters & numbers"
                                />
                            </div>
                        </div>

                        {/* Location Info */}
                        <div className="relative col-span-2">
                            <label className="block text-sm font-medium text-amber-800 mb-1">Full Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    name="address"
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-sky-50 text-black"
                                    placeholder="Street Address"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-amber-800 mb-1">Country</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    name="country"
                                    type="text"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-sky-50 text-black"
                                    placeholder="Country"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-amber-800 mb-1">Date of Birth</label>
                            <input
                                name="date_of_birth"
                                type="date"
                                required
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-sky-50 text-black"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
