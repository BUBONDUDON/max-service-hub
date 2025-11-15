export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-12 text-[#666666] dark:text-[#AAAAAA]">
      {Icon && <Icon size={48} className="mx-auto mb-4 opacity-50" />}
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm mt-2">{description}</p>}
    </div>
  );
}
