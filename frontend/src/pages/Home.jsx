
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, Users, ShieldCheck,
  Sparkles, GraduationCap, CheckCircle2
} from "lucide-react";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/Card";

const features = [
  {
    icon: BookOpen,
    title: "Discover Courses",
    desc: "Өөрийн сонирхол, хэрэгцээнд тохирсон хичээлүүдийг нэг дороос хайж олоорой."
  },
  {
    icon: Users,
    title: "Learn from Peers",
    desc: "Мэдлэг, туршлагатай оюутан багш нартай холбогдон хамтдаа суралцаарай."
  },
  {
    icon: ShieldCheck,
    title: "Build Trust",
    desc: "Баталгаажуулсан хэрэглэгч, үнэлгээ болон сэтгэгдэлд тулгуурлан сонголтоо хийгээрэй."
  }
];

export default function Home() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="overflow-hidden">
      <section className="relative bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-950 dark:to-slate-950">
        <PageContainer className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold text-indigo-600 shadow-sm dark:border-indigo-500/20 dark:bg-slate-900">
              <Sparkles size={15} />
              A smarter way to learn together
            </span>

            <h1 className="mt-7 text-5xl font-extrabold leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Your potential.
              <span className="mt-2 block text-indigo-600">
                No limits.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500 dark:text-slate-400">
              Educoli бол оюутнууд мэдлэгээ хуваалцаж,
              нэгнээсээ суралцан, хамтдаа хөгжих боломжтой
              сургалтын платформ юм.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="ui-button ui-button-primary"
              >
                Explore Courses <ArrowRight size={18} />
              </Link>

              <Link
                to={isLoggedIn ? "/learning-requests" : "/register"}
                className="ui-button ui-button-outline"
              >
                {isLoggedIn ? "Learning Requests" : "Get Started"}
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
              <CheckCircle2 size={18} className="text-emerald-500" />
              Learn together. Grow together.
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/10" />

            <Card className="relative shadow-2xl shadow-indigo-100/50 dark:shadow-none">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div className="rounded-xl bg-indigo-600 p-3 text-white">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <p className="font-bold">Learning Journey</p>
                  <p className="text-xs text-slate-500">
                    Your growth starts here
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["01", "Explore", "Өөрт тохирсон хичээлээ хайх"],
                  ["02", "Connect", "Багштай холбогдож хүсэлт илгээх"],
                  ["03", "Learn", "Хамтдаа суралцаж хөгжих"]
                ].map(([number, title, desc]) => (
                  <div
                    key={number}
                    className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-extrabold text-indigo-600 dark:bg-indigo-500/20">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-bold">{title}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {desc}
                      </p>
                    </div>
                    <CheckCircle2
                      size={19}
                      className="ml-auto shrink-0 text-indigo-500"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-indigo-600 p-5 text-white">
                <p className="text-sm font-semibold">
                  Learning is better together.
                </p>
                <p className="mt-1 text-xs text-indigo-100">
                  Share knowledge. Build connections.
                </p>
              </div>
            </Card>
          </div>
        </PageContainer>
      </section>

      <section className="py-20">
        <PageContainer>
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Why Educoli?
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need to grow.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Нэг платформ дээрээс суралцах, заах,
              мэдлэгээ хуваалцах боломжууд.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} hover>
                <div className="mb-5 inline-flex rounded-2xl bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-500/10">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {desc}
                </p>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="pb-20">
        <PageContainer>
          <div className="rounded-3xl bg-slate-900 px-7 py-12 text-center text-white sm:px-12">
            <h2 className="text-3xl font-extrabold">
              Ready to start learning?
            </h2>
            <p className="mt-4 text-slate-300">
              Өнөөдрөөс өөрийн суралцах аяллаа эхлүүлээрэй.
            </p>
            <Link
              to="/courses"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-indigo-50"
            >
              Browse Courses <ArrowRight size={17} />
            </Link>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
