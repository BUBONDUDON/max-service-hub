import SearchInput from "./SearchInput";
import SelectFilter from "./SelectFilter";
import TagFilter from "./TagFilter";

export default function FilterSidebar({
  searchTerm,
  onSearchChange,
  selectedCity,
  onCityChange,
  cities,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedTags,
  onTagToggle,
  tags,
  onReset,
}) {
  return (
    <aside className="w-full md:w-80 bg-white dark:bg-[#1E1E1E] border-r border-[#E0E0E0] dark:border-[#404040] min-h-[calc(100vh-88px)] flex flex-col">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#0D0D0D] dark:text-white">
            Фильтры
          </h2>
          <button
            onClick={onReset}
            className="text-sm text-[#FF6F3C] hover:text-[#FF4300] transition-colors duration-300 cursor-pointer"
          >
            Сбросить
          </button>
        </div>

        <div
          className="flex flex-col flex-1 space-y-6 overflow-hidden"
          style={{ padding: "0.2em" }}
        >
          <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Поиск по имени или описанию"
          />

          <SelectFilter
            label="Город"
            value={selectedCity}
            onChange={onCityChange}
            options={cities}
            placeholder="Все города"
          />

          <SelectFilter
            label="Категория"
            value={selectedCategory}
            onChange={onCategoryChange}
            options={categories}
            placeholder="Все категории"
          />

          <TagFilter
            label="Теги услуг"
            selectedTags={selectedTags}
            availableTags={tags}
            onToggle={onTagToggle}
          />
        </div>
      </div>
    </aside>
  );
}
