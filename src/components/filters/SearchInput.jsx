import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0D0D0D] dark:text-white mb-2">
        Поиск
      </label>
      <div className="relative">
        <Search
          size={20}
          className="absolute left-3 top-3 text-[#666666] dark:text-[#AAAAAA]"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#FF6F3C] dark:border-[#FF6F3C] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF4300] focus:border-transparent"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
