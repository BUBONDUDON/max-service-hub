import { MapPin, Star } from "lucide-react";

export default function ProviderInfo({ provider }) {
  const initial = provider.name ? provider.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 mb-8 border border-[#E0E0E0] dark:border-[#404040]">
      <div className="flex items-start md:flex-row flex-col gap-8">
        {provider.avatar && !provider.avatar.includes("placehold.co") ? (
          <img
            src={provider.avatar}
            alt={provider.name || "Мастер"}
            className="w-32 h-32 rounded-3xl object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#FF6F3C] to-[#FF4300] flex items-center justify-center">
            <span className="text-5xl font-semibold text-white">{initial}</span>
          </div>
        )}

        <div className="flex-1">
          <h1
            className="text-4xl font-semibold text-[#0D0D0D] dark:text-white mb-3"
            style={{ fontFamily: "Instrument Serif, serif" }}
          >
            {provider.name}
          </h1>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-[#666666] dark:text-[#AAAAAA]">
              <MapPin size={20} />
              <span>{provider.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={20} className="fill-[#FF4300] text-[#F59E0B]" />
              <span className="text-[#0D0D0D] dark:text-white font-semibold">
                {provider.rating}
              </span>
              <span className="text-[#666666] dark:text-[#AAAAAA]">
                ({provider.reviewCount} отзывов)
              </span>
            </div>
          </div>

          <p className="text-[#666666] dark:text-[#AAAAAA] leading-relaxed mb-6">
            {provider.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {provider.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-sm bg-[#FF6F3C]/10 text-[#FF6F3C] border border-[#FFF6F3C]/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
