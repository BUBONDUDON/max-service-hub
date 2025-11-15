import { useEffect, useState } from "react";
import { User, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleCard from "../components/common/RoleCard";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const { user, isProvider, loading: authLoading } = useAuth();

  const handleRoleSelect = (role) => {
    if (role === "provider") {
      if (isProvider) {
        navigate("/provider/dashboard");
      } else {
        navigate("/provider/setup");
      }
    } else {
      navigate("/customer/browse");
    }
  };

  useEffect(() => {
    const wa = window.WebApp;
    if (!wa) return;

    wa.ready();

    if (wa.initDataUnsafe?.user) {
      setData({
        version: wa.version,
        platform: wa.platform,
        initData: wa.initData,
        initDataUnsafe: wa.initDataUnsafe,
        user: wa.initDataUnsafe.user,
        chat: wa.initDataUnsafe.chat || null,
      });
    }

    const onReady = () => {
      if (wa.initDataUnsafe?.user) {
        setData({
          version: wa.version,
          platform: wa.platform,
          initData: wa.initData,
          initDataUnsafe: wa.initDataUnsafe,
          user: wa.initDataUnsafe.user,
          chat: wa.initDataUnsafe.chat || null,
        });
      }
    };

    wa.onEvent("WebAppReady", onReady);

    return () => wa.offEvent("WebAppReady", onReady);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6F3] to-[#ECE9E5] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
        <header className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
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

        <main className="px-4 sm:px-6 py-6 sm:py-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-[#0D0D0D] dark:text-white mb-4 sm:mb-6 max-w-4xl mx-auto"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: "600",
                letterSpacing: "0.02em",
              }}
            >
              {authLoading
                ? "Загрузка..."
                : user
                ? `Привет, ${user.full_name}!`
                : "Присоединяйтесь к нашей платформе услуг"}
            </h1>
            <p className="text-base sm:text-lg text-[#555555] dark:text-[#C0C0C0] opacity-80 mb-12 sm:mb-16 max-w-[50ch] mx-auto px-4">
              Выберите свою роль и начните работать с клиентами или находить
              нужные услуги
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-[700px] mx-auto">
              <RoleCard
                role={"provider"}
                title={"Я исполнитель"}
                description={
                  "Создайте свой профиль, добавьте услуги и управляйте расписанием. Привлекайте клиентов и развивайте свой бизнес."
                }
                features={[
                  "Создание профиля и портфолио",
                  "Управление услугами и ценами",
                  "Календарь и статистика",
                ]}
                handleRoleSelect={() => handleRoleSelect("provider")}
              />
              <RoleCard
                role={"customer"}
                title={"Я заказчик"}
                description={
                  "Найдите идеального мастера для ваших нужд. Просматривайте профили, сравнивайте цены и записывайтесь на удобное время."
                }
                features={[
                  "Поиск мастеров по категориям",
                  "Фильтрация по городу и тегам",
                  "Удобное бронирование",
                ]}
                handleRoleSelect={() => handleRoleSelect("customer")}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
