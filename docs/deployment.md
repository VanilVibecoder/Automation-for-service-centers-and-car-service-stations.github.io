# Развёртывание

## Требования

- n8n с поддержкой Code, Postgres, HTTP Request и Execute Sub-workflow;
- PostgreSQL или Supabase;
- Telegram bot token;
- операторский Telegram-чат;
- Ollama;
- модель `qwen2.5:7b`;
- Docker Desktop — для текущего URL `host.docker.internal`.

## 1. База данных

Workflow зависят от таблиц и SQL-функций, перечисленных в [../sql/README.md](../sql/README.md).

Репозиторий содержит workflow-слой и документацию. Полный production dump базы не публикуется, потому что исходные DDL и все тела функций не были переданы в составе экспортов.

Перед переносом проекта экспортируйте schema/functions из исходного Supabase/PostgreSQL.

## 2. Ollama

```bash
ollama pull qwen2.5:7b
ollama serve
```

Проверка:

```bash
curl http://localhost:11434/api/tags
```

В Docker Desktop workflow используют:

```text
http://host.docker.internal:11434/api/chat
```

Если n8n запущен не в Docker, замените URL на адрес Ollama, доступный из n8n.

## 3. Импорт workflow

Импортируйте JSON в таком порядке:

1. `workflows/03_ingress_core.json`;
2. `workflows/21_handle_request_STABLE.json`;
3. `workflows/10_process_conversation_turn_STABLE.json`;
4. `workflows/01_channel_telegram.json`.

После импорта:

- создайте Postgres credential;
- создайте Telegram credential;
- назначьте credentials всем Postgres и Telegram nodes;
- в `10_process_conversation_turn_STABLE` выберите `21_handle_request_STABLE` в `13 Execute Request Handler`;
- в `01_channel_telegram` выберите `03_ingress_core` и `10_process_conversation_turn_STABLE` в Execute Sub-workflow nodes.

Workflow ID исходного инстанса очищены, поэтому sub-workflow нужно выбрать вручную.

## 4. Channel Configuration

В `01_channel_telegram` откройте `02 Channel Configuration`.

Замените:

```text
_config.tenant_id
_config.channel_account_id
_config.operator_chat_id
_config.operator_user_ids
```

Демо-placeholder:

```text
operator_chat_id = -1000000000000
operator_user_ids = ["000000000"]
```

Для получения Telegram ID используйте собственный тестовый бот/чат. Не публикуйте реальные ID в открытом репозитории.

## 5. PostgreSQL credential

Рекомендуемые поля для Supabase Session Pooler:

- Host: pooler host проекта;
- Port: `5432`;
- Database: `postgres`;
- User: пользователь pooler;
- SSL: require.

Все запросы в workflow используют query parameters, а не конкатенацию пользовательского ввода.

## 6. Публикация

Опубликуйте дочерние workflow, затем основной Telegram workflow.

Порядок:

1. ingress;
2. request handler;
3. conversation turn;
4. channel workflow.

## 7. Smoke test

Отправьте:

```text
Кондиционер Haier не охлаждает. Зеленоград, корпус 458.
```

Ожидается:

1. определение услуги;
2. предложение слотов;
3. выбор слота;
4. карточка подтверждения;
5. создание заявки;
6. уведомление оператору.

Дополнительно:

```text
Розетка возле кондиционера искрит
```

Ожидается unsafe-ответ и операторский handoff.

## 8. Проверка очередей

```sql
SELECT *
FROM messages
WHERE direction = 'inbound'
  AND processing_status = 'processing'
ORDER BY created_at;
```

```sql
SELECT *
FROM messages
WHERE direction = 'outbound'
  AND delivery_status IS DISTINCT FROM 'sent'
ORDER BY created_at;
```

После чистого smoke-теста новые строки не должны оставаться необъяснимо зависшими.
