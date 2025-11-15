import { useState } from "react";
import { ArrowLeft, Plus, X, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/createClient";

export default function ProviderSetupPage() {
  const navigate = useNavigate();
  const { user, becomeProvider, updateProfile } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newTag, setNewTag] = useState("");

  const predefinedTags = [
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

  const handleAddTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (city && city !== user.city) {
        await updateProfile({ city });
      }

      await becomeProvider(bio);

      if (tags.length > 0) {
        const tagInserts = tags.map((tag) => ({
          performer_id: user.id,
          tag: tag,
        }));

        const { error: tagsError } = await supabase
          .from("performer_tags")
          .insert(tagInserts);

        if (tagsError) throw tagsError;
      }

      navigate("/provider/dashboard");
    } catch (err) {
      console.error("Ошибка регистрации исполнителя:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#FF6F3C] to-[#FF6F3C] rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <User size={28} className="text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-semibold text-[#0D0D0D] dark:text-white mb-3">
          Основная информация
        </h2>
        <p className="text-[#666666] dark:text-[#AAAAAA]">
          Расскажите о себе и своей деятельности
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
            Ваше имя
          </label>
          <input
            type="text"
            value={user?.full_name || ""}
            disabled
            className="w-full px-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] bg-[#F8F6F3] dark:bg-[#262626] text-[#666666] dark:text-[#AAAAAA]"
          />
          <p className="text-xs text-[#666666] dark:text-[#AAAAAA] mt-1">
            Имя берётся из вашего профиля MAX
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
            Город
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent"
            placeholder="Ваш город"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
            О себе
          </label>
          <div className="relative">
            <FileText
              size={20}
              className="absolute left-3 top-3.5 text-[#666666] dark:text-[#AAAAAA]"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent resize-none"
              placeholder="Расскажите о себе и ваших услугах..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-[#0D0D0D] dark:text-white mb-3">
          Теги услуг
        </h2>
        <p className="text-[#666666] dark:text-[#AAAAAA]">
          Выберите теги, которые описывают ваши услуги
        </p>
      </div>

      <div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-[#FF6F3C] text-white"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTag(newTag)}
            className="flex-1 px-4 py-2 rounded-xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] focus:border-transparent"
            placeholder="Добавить свой тег"
          />
          <button
            onClick={() => handleAddTag(newTag)}
            className="px-4 py-2 bg-[#FF6F3C] text-white rounded-xl hover:bg-[#FF4300] transition-colors duration-300 cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {predefinedTags
            .filter((tag) => !tags.includes(tag))
            .map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="px-3 py-1.5 rounded-full text-sm border border-[#E0E0E0] dark:border-[#404040] text-[#666666] dark:text-[#AAAAAA] hover:border-[#FF6F3C] hover:text-[#FF6F3C] transition-colors duration-300 cursor-pointer"
              >
                {tag}
              </button>
            ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      default:
        return renderStep1();
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return city && bio;
      case 2:
        return tags.length > 0;
      default:
        return false;
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400;500&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gradient-to-br from-[#F8F6F3] to-[#ECE9E5] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
        <header className="px-6 py-6">
          <div className="max-w-[800px] mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#666666] dark:text-[#AAAAAA] hover:text-[#0D0D0D] dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Назад
            </button>

            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 211 41"
                width="211"
                height="41"
              >
                <path
                  fill="#FF6F3C"
                  d="M194.8,40.4h-61.7c-2.1,0-3.4-1.8-2.8-4l9.2-32.5c0.5-1.8,2.4-3.3,4.2-3.3h61.7c2.1,0,3.4,1.8,2.8,4l-9.2,32.5c-0.5,1.8-2.4,3.3-4.2,3.3Z"
                />
                <path
                  fill="#FF6F3C"
                  d="M11.6,16.7l-0.6,1.9h10.2l-2,7.4-3.7,2.6H0l1.3-4.4h10.2l0.6-2H1.9l2-7.3,3.7-2.7h15.4l-1.2,4.4h-10.2ZM20.6,28.6l4.7-16.3h17.3l-1.3,4.4h-9.2l-0.6,1.9h9.2l-1.1,3.6h-9.2l-0.6,1.9h9.2l-1.2,4.4h-17.4ZM39.6,28.6l4.7-16.3h19.2l-2,6.9-4.3,1.6,3.4,1.3-1.9,6.6h-8.5l1.3-4.4h-2l-1.3,4.4h-8.7ZM53.2,18.7l0.6-1.9h-1.9l-0.6,1.9h2ZM65.1,12.4h8.5l-2.8,10h2l2.8-10h8.5l-2.8,10-8.6,6.3h-5.2l-5.1-6.3,2.8-10ZM93.9,12.4l-4.7,16.3h-8.1l4.7-16.3h8.1ZM91,28.6l4.7-16.3h18.6l-2,7.1h-8.5l0.8-2.7h-2l-2.2,7.6h1.9l0.8-2.9h8.5l-1.3,4.7-3.7,2.6h-15.7ZM111.2,28.6l4.7-16.3h17.3l-1.3,4.4h-9.2l-0.6,1.9h9.2l-1.1,3.6h-9.2l-0.6,1.9h9.2l-1.2,4.4h-17.4Z"
                />
                <path
                  fill="#1A1A1A"
                  d="M141.2,12.4h8.5l-1.8,6.3h2l1.7-6.3h8.5l-4.7,16.3h-8.5l1.7-6.3h-1.9l-1.7,6.3h-8.5l4.7-16.3ZM157.2,28.6l4.7-16.3h8.6l-3.4,11.9h1.9l3.4-11.9h8.6l-3.9,13.7-3.7,2.6h-16.3ZM178.1,28.6l4.7-16.3h19.4l-2,6.9-3,1.3,2.5,0.7-1.4,4.7-3.7,2.6h-16.5ZM190.5,22.3h-1.9l-0.6,1.9h2l0.6-1.9ZM190.2,16.7l-0.6,1.9h2l0.6-1.9h-2Z"
                />
              </svg>
            </div>
          </div>
        </header>

        <div className="px-6 mb-8">
          <div className="max-w-[800px] mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#666666] dark:text-[#AAAAAA]">
                Шаг {currentStep} из {totalSteps}
              </span>
              <span className="text-sm text-[#666666] dark:text-[#AAAAAA]">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#E0E0E0] dark:bg-[#404040] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#FF6F3C] to-[#FF4300] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <main className="px-6 pb-12">
          <div className="max-w-[800px] mx-auto">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 shadow-lg">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {renderCurrentStep()}

              <div className="flex justify-between mt-12 pt-8 border-t border-[#E0E0E0] dark:border-[#404040]">
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] text-[#666666] dark:text-[#AAAAAA] hover:border-[#FF6F3C] dark:hover:border-[#FF6F3C] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {currentStep === 1 ? "На главную" : "Назад"}
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isStepValid() || loading}
                  className={`px-6 py-3 rounded-2xl text-white transition-colors ${
                    isStepValid() && !loading
                      ? "bg-gradient-to-r from-[#FF8D64] to-[#FF642D] hover:from-[#FF6F3C] hover:to-[#FF4300] transition-colors duration-300 cursor-pointer"
                      : "bg-[#C0C0C0] dark:bg-[#404040] cursor-not-allow"
                  }`}
                >
                  {loading
                    ? "Сохранение..."
                    : currentStep === totalSteps
                    ? "Завершить"
                    : "Далее"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
