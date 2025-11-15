import ServiceItem from "./ServiceItem";

export default function ServicesList({ services, onServiceSelect }) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 md:p-8 border border-[#E0E0E0] dark:border-[#404040]">
      <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white mb-6">
        Услуги
      </h2>

      <div className="space-y-6">
        {services.length === 0 ? (
          <p className="text-gray-500">Услуги не добавлены</p>
        ) : (
          services.map((category) => (
            <div key={category.category}>
              <h3 className="text-lg font-medium text-[#0D0D0D] dark:text-white mb-3">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((service) => (
                  <ServiceItem
                    key={service.id}
                    service={service}
                    onSelect={onServiceSelect}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
