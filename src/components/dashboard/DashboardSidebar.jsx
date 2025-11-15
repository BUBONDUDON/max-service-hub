import { X } from "lucide-react";

export default function DashboardSidebar({
  tabs,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1E1E1E] border-r border-[#E0E0E0] dark:border-[#404040]
        transform transition-transform duration-300 md:static md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center justify-between p-4 md:hidden border-b border-[#E0E0E0] dark:border-[#404040]">
        <span className="font-medium text-[#0D0D0D] dark:text-white">Меню</span>
        <button
          onClick={onClose}
          className="text-[#666666] dark:text-[#AAAAAA]"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="p-6 space-y-2 flex-1 overflow-y-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                activeTab === tab.id
                  ? "bg-[#FF6F3C] text-white"
                  : "text-[#666666] dark:text-[#AAAAAA] hover:bg-[#F8F6F3] dark:hover:bg-[#262626] hover:text-[#0D0D0D] dark:hover:text-white"
              }`}
            >
              <IconComponent size={20} strokeWidth={1.5} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
