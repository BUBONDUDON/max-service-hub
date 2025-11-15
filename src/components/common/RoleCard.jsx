import { User, Store } from "lucide-react";

const RoleCard = ({ role, title, description, features, handleRoleSelect }) => {
  return (
    <div
      className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#1E1E1E] hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-all duration-200 cursor-pointer hover:border-[#FF6F3C] dark:hover:border-[#FF6F3C] hover:shadow-lg"
      onClick={handleRoleSelect}
    >
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16  ${
          role === "provider" ? "bg-[#FF6F3C]" : "bg-[#FF6F3C]"
        } rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-105 transition-transform duration-200`}
      >
        {role === "provider" ? (
          <>
            <Store
              size={24}
              className="sm:hidden text-white"
              strokeWidth={1.5}
            />
            <Store
              size={28}
              className="hidden sm:block text-white"
              strokeWidth={1.5}
            />
          </>
        ) : (
          <>
            <User
              size={24}
              className="sm:hidden text-white"
              strokeWidth={1.5}
            />
            <User
              size={28}
              className="hidden sm:block text-white"
              strokeWidth={1.5}
            />
          </>
        )}
      </div>

      <h2
        className="text-xl sm:text-2xl font-semibold text-[#0D0D0D] dark:text-white mb-3 sm:mb-4"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {title}
      </h2>

      <p className="text-sm sm:text-base text-[#666666] dark:text-[#AAAAAA] leading-relaxed mb-4 sm:mb-6">
        {description}
      </p>

      <ul className="text-xs sm:text-sm text-[#777777] dark:text-[#999999] space-y-2 text-left">
        {features.map((feature, index) => (
          <li className="flex items-center" key={index}>
            <div
              className={`w-1.5 h-1.5 ${
                role === "provider" ? "bg-[#FF6F3C]" : "bg-[#FF6F3C]"
              }  rounded-full mr-2 sm:mr-3`}
            ></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleCard;
