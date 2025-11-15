import { ArrowLeft, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

export default function PageHeader({
  backTo,
  backLabel = "Назад",
  showUser = false,
  userName,
  userCity,
  userAvatar,
  onMenuClick,
}) {
  const navigate = useNavigate();

  return (
    <header className="px-4 md:px-6 py-4 md:py-6 border-b border-[#E0E0E0] dark:border-[#404040] bg-white/50 dark:bg-[#1E1E1E]/50 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-6">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden text-[#666666] dark:text-[#AAAAAA]"
            >
              <Menu size={24} />
            </button>
          )}

          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="flex items-center gap-2 text-[#666666] dark:text-[#AAAAAA] hover:text-[#0D0D0D] dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">{backLabel}</span>
            </button>
          )}

          <Logo />
        </div>

        {showUser && (
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6F3C] to-[#9D7DFF] rounded-xl flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[#0D0D0D] dark:text-white">
                  {userName}
                </p>
                {userCity && (
                  <p className="text-xs text-[#666666] dark:text-[#AAAAAA]">
                    {userCity}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
