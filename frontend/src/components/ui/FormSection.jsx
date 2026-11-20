
import Card from "./Card";

export default function FormSection({
  title, description, icon: Icon, children
}) {
  return (
    <Card>
      <div className="mb-6 flex items-start gap-3">
        {Icon && (
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10">
            <Icon size={21} />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </Card>
  );
}
