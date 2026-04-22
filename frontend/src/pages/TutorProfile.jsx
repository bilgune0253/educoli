import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import StatCard from "../components/StatCard";

function TutorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTutorProfile = async () => {
            try {
                const res = await api.get(`/tutors/${id}`);
                setProfile(res.data);
            } catch (err) {
                setMessage(err.response?.data?.error || "Failed to load tutor profile");
            }
        };

        fetchTutorProfile();
    }, [id]);

    if (message) {
        return (
            <PageContainer className="py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    ← Back
                </button>
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-slate-600 dark:text-slate-300">{message}</p>
                </div>
            </PageContainer>
        );
    }

    if (!profile) {
        return (
            <PageContainer className="py-10">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-slate-600 dark:text-slate-300">Loading tutor profile...</p>
                </div>
            </PageContainer>
        );
    }

    const { tutor, courses, reviews, stats } = profile;

    return (
        <PageContainer className="py-10">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    ← Back
                </button>

                <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    Tutor Profile
                </span>
            </div>

            <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Student Tutor
                </p>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    {tutor.name}
                    {tutor.is_verified && (
                        <span className="ml-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                            ✓ Verified
                        </span>
                    )}
                </h1>
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                    {tutor.student_code}
                </p>
                <p className="mt-3 text-slate-500 dark:text-slate-400">{tutor.email}</p>
            </div>

            <div className="mb-10 grid gap-5 md:grid-cols-3">
                <StatCard
                    label="Total Courses"
                    value={stats.totalCourses}
                    color="text-slate-900 dark:text-white"
                />
                <StatCard
                    label="Average Rating"
                    value={stats.averageRating}
                    color="text-amber-600"
                />
                <StatCard
                    label="Total Reviews"
                    value={stats.totalReviews}
                    color="text-emerald-600"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-5 text-2xl font-bold text-slate-900 dark:text-white">
                        Tutor Courses
                    </h2>

                    {courses.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400">No courses yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {course.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                {course.type} • ₮ {course.price}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/courses/${course.id}`}
                                            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-5 text-2xl font-bold text-slate-900 dark:text-white">
                        Reviews
                    </h2>

                    {reviews.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {review.student_name}
                                        </p>
                                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                                            {review.rating}/5
                                        </span>
                                    </div>

                                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}

export default TutorProfile;