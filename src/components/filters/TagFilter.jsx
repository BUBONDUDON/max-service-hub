export default function TagFilter({
  label,
  selectedTags,
  availableTags,
  onToggle,
}) {
  return (
    <div className="flex flex-col overflow-hidden">
      <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
        {label}
      </label>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#FF6F3C] text-white cursor-pointer"
              onClick={() => onToggle(tag)}
            >
              {tag}
              <span className="ml-1 text-sm">×</span>
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 overflow-y-auto md:overflow-visible">
        {availableTags
          .filter((tag) => !selectedTags.includes(tag))
          .map((tag) => (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className="px-3 py-1 rounded-full text-sm border border-[#FF6F3C] dark:border-[#FF6F3C] text-[#FF6F3C] dark:text-[#FF6F3C] hover:border-[#FF4300] hover:text-[#FF4300] transition-colors delay-300s"
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
}
