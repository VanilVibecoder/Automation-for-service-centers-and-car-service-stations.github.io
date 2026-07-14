# Тест-кейсы

## Финальный smoke/regression набор

| ID | Сценарий | Вход | Ожидаемый результат | Статус демо |
|---|---|---|---|---|
| T01 | Полная новая заявка | `Кондиционер Haier не охлаждает. Зеленоград, корпус 458.` | Услуга найдена, показаны слоты, после подтверждения создана заявка | Пройден |
| T02 | Не хватает города | `Кондиционер Haier не охлаждает` | Бот спрашивает город, `pending_action=collect:city` | Пройден |
| T03 | Выбор слота | callback `slot:<uuid>` | Создан активный hold, показана карточка подтверждения | Пройден |
| T04 | Unsafe | `Розетка возле кондиционера искрит` | Безопасная инструкция, state=`handoff`, карточка оператору | Пройден |
| T05 | Живой сотрудник | `Позовите сотрудника` | Клиент получает подтверждение, оператор получает карточку | Пройден |
| T06 | Изменение заявки | `Хочу поменять дату одной из моих заявок` | Hard rule `change_request`, оператор видит активные заявки | Пройден |
| T07 | Возврат боту | оператор нажимает `Вернуть боту` | state=`new`, draft/hold/pending очищены | Пройден |
| T08 | Unsupported input | voice | Клиенту предлагается написать текстом, inbound становится `processed` | Пройден |
| T09 | Зона вне обслуживания | Москва при демо-зоне Зеленограда | Без случайного слота: обращение передано сотруднику | Пройден |
| T10 | Повторное событие | тот же `external_event_id` | Ingress возвращает `duplicate`, новый ход не создаётся | Проверить при переносе |

## Проверки БД

### Нет зависших inbound

```sql
SELECT
    id,
    conversation_id,
    message_type,
    processing_started_at,
    created_at
FROM messages
WHERE direction = 'inbound'
  AND processing_status = 'processing'
ORDER BY created_at;
```

### Нет необъяснимых outbound

```sql
SELECT
    id,
    conversation_id,
    delivery_status,
    delivery_error,
    created_at
FROM messages
WHERE direction = 'outbound'
  AND delivery_status IS DISTINCT FROM 'sent'
ORDER BY created_at;
```

### Заявка создана один раз

```sql
SELECT
    request_number,
    conversation_id,
    source_message_id,
    status,
    created_at
FROM service_requests
ORDER BY created_at DESC;
```

## Критерий приёмки

- основной путь завершается созданием одной заявки;
- нет необъяснимых сообщений в `processing`;
- delivery command валиден;
- unsafe и human request не продолжают обычное оформление;
- повторный callback не создаёт вторую заявку;
- устаревшая версия возвращает `superseded`;
- операторская карточка содержит достаточный контекст.
