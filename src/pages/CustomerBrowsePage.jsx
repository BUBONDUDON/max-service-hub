import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProviderCard from "../components/providers/ProviderCard";
import FilterSidebar from "../components/filters/FilterSidebar";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import { useProviders } from "../hooks/userProviders";

export default function CustomerBrowsePage() {
  const { providers, loading, error } = useProviders();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const cities = [
    "Москва",
    "Санкт-Петербург",
    "Новосибирск",
    "Екатеринбург",
    "Казань",
  ];
  const categories = [
    "Маникюр",
    "Педикюр",
    "Наращивание",
    "Массаж",
    "Стрижка",
    "Окрашивание",
  ];
  const tags = [
    "маникюр",
    "педикюр",
    "наращивание",
    "дизайн ногтей",
    "массаж",
    "стрижка",
    "окрашивание",
    "укладка",
    "брови",
    "ресницы",
    "косметология",
    "депиляция",
    "татуаж",
    "макияж",
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setSelectedCategory("");
    setSelectedTags([]);
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = !selectedCity || provider.city === selectedCity;

    const matchesCategory = true;

    const matchesTags =
      selectedTags.length === 0 ||
      (Array.isArray(provider.tags) &&
        selectedTags.some((tag) => provider.tags.includes(tag)));

    return matchesSearch && matchesCity && matchesCategory && matchesTags;
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F3] to-[#ECE9E5] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
      <PageHeader backTo="/" backLabel="На главную" />

      <div className="flex flex-wrap">
        <FilterSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          cities={cities}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          tags={tags}
          onReset={handleResetFilters}
        />

        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-[800px]">
            <div className="mb-8">
              <h1
                className="text-3xl font-semibold text-[#0D0D0D] dark:text-white mb-3"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Найти мастера
              </h1>
              <p className="text-[#666666] dark:text-[#AAAAAA]">
                Выберите подходящего специалиста для ваших потребностей
              </p>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mt-2">
                {loading
                  ? "Загрузка..."
                  : `Найдено мастеров: ${filteredProviders.length}`}
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#404040] animate-pulse"
                  >
                    <div className="flex items-start flex-col md:flex-row gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>

                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          </div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </div>

                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        </div>

                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                        </div>

                        <div className="flex gap-2">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
                        </div>

                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <EmptyState
                icon={Search}
                title="Ошибка загрузки"
                description={error}
              />
            ) : filteredProviders.length === 0 ? (
              <EmptyState
                icon={Search}
                title="По вашему запросу ничего не найдено"
                description="Попробуйте изменить параметры поиска"
              />
            ) : (
              <div className="flex flex-col gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    name={provider.name}
                    avatar={provider.avatar}
                    description={provider.description}
                    city={provider.city}
                    categories={provider.categories}
                    tags={provider.tags}
                    priceFrom={provider.priceFrom}
                    key={provider.id}
                    onClick={() =>
                      navigate(`/customer/provider/${provider.id}`)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
