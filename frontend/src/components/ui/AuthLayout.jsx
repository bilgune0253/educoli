
import { GraduationCap, ShieldCheck, Sparkles, Users } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 inline-flex rounded-2xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/20">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 mb-8 text-sm leading-7 text-slate-500">
            {subtitle}
          </p>
          <div className="ui-card p-6 sm:p-8">{children}</div>
        </div>
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-12 text-white lg:flex">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-md">
          <Sparkles size={36} className="mb-8 text-indigo-200" />
          <h2 className="text-5xl font-extrabold leading-tight">
            Learn together.
            <br />Grow together.
          </h2>
          <p className="mt-6 leading-8 text-indigo-100">
            Educoli — оюутнууд мэдлэгээ хуваалцаж,
            хамтдаа хөгжих сургалтын платформ.
          </p>
          <div className="mt-10 grid gap-4">
            {[
              [Users, "Connect with student tutors"],
              [ShieldCheck, "Build a trusted learning community"]
            ].map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4">
                <Icon size={21} />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
