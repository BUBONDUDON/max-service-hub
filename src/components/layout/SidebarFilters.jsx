import { Search } from "lucide-react";

export default function SidebarFilters({
  searchTerm,
  setSearchTerm,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  setSelectedTags,
  cities,
  categories,
  tags,
}) {
  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  return (
    <aside className="w-80 bg-white dark:bg-[#1E1E1E] border-r border-[#E0E0E0] dark:border-[#404040] min-h-[calc(100vh-88px)]">
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
            Поиск
          </label>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-3 text-[#666666]"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626]"
              placeholder="Поиск"
            />
          </div>
        </div>

        <label className="block text-sm mb-2">Город</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl border bg-white dark:bg-[#262626]"
        >
          <option value="">Все города</option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label className="block text-sm mb-2">Категория</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl border bg-white dark:bg-[#262626]"
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label className="block text-sm mb-3">Теги услуг</label>

        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs border ${
                selectedTags.includes(tag)
                  ? "bg-[#FF6F3C] text-white border-transparent"
                  : "border-[#E0E0E0] text-[#666666]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
