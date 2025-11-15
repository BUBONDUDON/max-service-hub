# Интеграция API для календаря

## Реализованная интеграция

### API Layer

**Путь:** `src/Api/timeSlots.js`

Функции для работы с БД:

- `fetchSlots(performerId)` - получить все слоты мастера
- `createSlot({ performer_id, start_time, end_time })` - создать слот
- `updateSlot(id, updateData)` - обновить слот
- `deleteSlot(id)` - удалить слот

**Формат данных из БД:**

```javascript
{
  id: number,
  start: string,      // ISO timestamp (2024-11-15T10:00:00)
  end: string,        // ISO timestamp (2024-11-15T11:00:00)
  available: boolean  // true = свободен, false = занят
}
```

### Hook

**Путь:** `src/hooks/useTimeSlots.js`

Хук для управления слотами:

```javascript
const {
  slots, // массив слотов
  loading, // флаг загрузки
  error, // ошибка
  addSlot, // функция создания
  editSlot, // функция редактирования
  removeSlot, // функция удаления
  reload, // функция перезагрузки
} = useTimeSlots(performerId);
```

## Интеграция в ProviderDashboardPage

### Подключение хука

```javascript
const {
  slots,
  loading: slotsLoading,
  addSlot,
  editSlot,
  removeSlot,
} = useTimeSlots(id);
```

### Функции-обработчики

#### handleAddSlot

Преобразует данные формы в формат API:

- Дата + время → ISO timestamp для start_time
- Дата + время + длительность → ISO timestamp для end_time
- Вызывает `addSlot` из хука

```javascript
const handleAddSlot = async (formData) => {
  const startTime = `${formData.date}T${formData.time}:00`;
  const startDate = new Date(startTime);
  const endDate = new Date(startDate.getTime() + formData.duration * 60000);

  await addSlot({
    performer_id: id,
    start_time: startTime,
    end_time: endDate.toISOString(),
  });
};
```

#### handleEditSlot

Аналогично преобразует данные и вызывает `editSlot`:

```javascript
const handleEditSlot = async (slotId, formData) => {
  const startTime = `${formData.date}T${formData.time}:00`;
  const endDate = new Date(
    new Date(startTime).getTime() + formData.duration * 60000
  );

  await editSlot(slotId, {
    start_time: startTime,
    end_time: endDate.toISOString(),
  });
};
```

#### handleDeleteSlot

Просто вызывает `removeSlot`:

```javascript
const handleDeleteSlot = async (slotId) => {
  await removeSlot(slotId);
};
```

## Интеграция в CalendarTab

### Преобразование данных для FullCalendar

Слоты из API (start/end) напрямую используются в FullCalendar:

```javascript
const events = slots.map((slot) => ({
  id: slot.id,
  title: slot.available ? "🟢 Свободно" : "🔴 Занято",
  start: slot.start, // ISO timestamp
  end: slot.end, // ISO timestamp
  backgroundColor: slot.available ? "#10B981" : "#F59E0B",
}));
```

### Обработка клика по событию

При клике на событие преобразуем формат API обратно в формат формы:

```javascript
const handleEventClick = (info) => {
  const slot = slots.find((s) => s.id === slotId);
  const startDate = new Date(slot.start);
  const endDate = new Date(slot.end);
  const duration = Math.round((endDate - startDate) / 60000);

  setSelectedSlot({
    id: slot.id,
    date: startDate.toISOString().split("T")[0], // YYYY-MM-DD
    time: startDate.toTimeString().slice(0, 5), // HH:MM
    duration: duration, // минуты
    available: slot.available,
  });
};
```

## Поток данных

### Создание слота

1. Пользователь заполняет форму (дата, время, длительность)
2. `handleAddSlot` преобразует в ISO timestamps
3. `addSlot` отправляет в Supabase
4. Хук добавляет новый слот в локальное состояние
5. CalendarTab автоматически обновляется

### Редактирование слота

1. Пользователь кликает на событие
2. `handleEventClick` преобразует API формат в формат формы
3. Пользователь редактирует данные
4. `handleEditSlot` преобразует обратно в ISO timestamps
5. `editSlot` обновляет в Supabase
6. Хук обновляет локальное состояние

### Удаление слота

1. Пользователь кликает "Удалить"
2. `handleDeleteSlot` вызывает `removeSlot`
3. Слот удаляется из Supabase
4. Хук удаляет из локального состояния

## Преимущества реализации

1. **Автоматическая синхронизация** - хук управляет локальным состоянием
2. **Оптимистичные обновления** - UI обновляется сразу
3. **Единый источник правды** - данные из БД
4. **Типобезопасность** - чёткие форматы данных
5. **Переиспользование** - хук можно использовать в других компонентах

## Структура таблицы time_slots

```sql
CREATE TABLE time_slots (
  id SERIAL PRIMARY KEY,
  performer_id UUID REFERENCES profiles(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Следующие шаги

1. Добавить обработку бронирований (is_available = false)
2. Добавить связь с таблицей bookings
3. Добавить валидацию конфликтов слотов
4. Добавить массовое создание слотов
5. Добавить уведомления о новых бронированиях
