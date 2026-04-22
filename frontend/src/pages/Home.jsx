import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";

function Home() {
  const stats = [
    { label: "Courses", value: "10+" },
    { label: "Active Students", value: "50+" },
    { label: "Tutors", value: "15+" },
  ];

  const features = [
    {
      title: "Зөв багшаа сонгоорой",
      desc: "Хичээлүүдийг сэдвээр нь үзэж, багш нарыг харьцуулж, суралцах хэрэгцээндээ хамгийн сайн тохирохыг нь сонгоорой.",
    },
    {
      title: "Хялбар хүсэлт илгээх ба удирдах. ",
      desc: "Нэг товч дараад л хүсэлт илгээх боломжтой ба оюутан багш мөн нэг товч дараад хүсэлтийг удирдах боломжтой.",
    },
    {
      title: "Шүүмлэл болон үнэлгээг үзэж, чанартай багшийг сонгоорой",
      desc: "Үнэлгээ болон сэтгэгдэл нь оюутнуудад чанартай багш сонгох, сургалтын үр дүнг сайжруулахад тусалдаг..",
    },
  ];

  return (
    <div className="overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <PageContainer className="py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              Оюутан хоорондын суралцах платформ
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Learn from
              <span className="block text-indigo-600 dark:text-indigo-400">students like you</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Educoli бол оюутан залуус орчин үеийн вэб ашиглан нэгнээсээ суралцаж мэдлэгээ дээшлүүлэх боломжтой оюутан хоорондын сургалтын платформ юм.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Хичээлүүд харах
              </Link>

              <Link
                to="/register"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Join Educoli
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-500/20" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/20" />

            <div className="relative rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-900 p-6 text-white dark:bg-slate-800">
                  <p className="text-2xl text-slate-300">Үйл ажиллагаа</p>
                  <h3 className="mt-2 text-sm font-bold">Хүсэл илгээх → Хүлээн авах → Суралцах</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Students browse available courses, send requests, tutors accept them,
                    and the learning session begins.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-emerald-50 p-5 dark:bg-emerald-500/10">
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Суралцагчид</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 text-justify">
                      Сонирхож буй хичээлээ сонгоод хүсэлт илгээнэ. Уг хичээлийг зааж буй оюутан багш анги дүүргэлтээс хамааран хүсэлтийг хүлээн авснаар суралцах боломжтой болно.
                    </p>
                  </div>

                  <div className="rounded-3xl bg-amber-50 p-5 dark:bg-amber-500/10">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Оюутан багш</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 text-justify">
                      Өөрийн эзэмшсэн мэдлэгийн хүрээнд хичээлүүд үүсгэж, суралцагчдын хүсэлтийг удирдах боломжтой ба Хичээлийг заах төрлийг тодорхойлж зохицуулах боломжтой.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-indigo-50 p-5 dark:bg-indigo-500/10">
                  <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Clean architecture</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Built with React, Express, PostgreSQL, JWT authentication, and role-based access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      <PageContainer className="pb-16 sm:pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}

export default Home;