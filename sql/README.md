# PostgreSQL / Supabase

## Важное ограничение репозитория

Экспортированные n8n workflow вызывают SQL-функции, но n8n JSON не содержит их тела. Полный dump базы не был передан вместе с четырьмя workflow, поэтому этот каталог содержит manifest и команды экспорта, а не выдуманную схему.

Для публичного портфолио этого достаточно, но для воспроизводимого развёртывания нужно добавить:

```text
sql/schema.sql
sql/functions.sql
sql/seed_demo_data.sql
```

## Требуемые функции

```text
ingest_channel_event
claim_conversation_turn
merge_request_draft
create_clarification_response
create_slot_offer_response
hold_selected_slot_response
submit_confirmed_request_response
change_slot_response
cancel_draft_response
reopen_draft_for_edit_response
handle_service_resolution_fallback
handle_human_request_response
create_unsafe_handoff_response
create_unsupported_input_response
apply_operator_handoff_action
```

## Основные таблицы

```text
organizations
customers
conversations
messages
service_catalog
service_areas
availability_slots
slot_holds
service_requests
```

## Экспорт schema через pg_dump

```bash
pg_dump "$DATABASE_URL" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --schema=public \
  > sql/schema.sql
```

## Экспорт demo seed

Экспортируйте только синтетические справочники. Не публикуйте клиентов, телефоны и сообщения.

```bash
pg_dump "$DATABASE_URL" \
  --data-only \
  --inserts \
  --table=public.organizations \
  --table=public.service_catalog \
  --table=public.service_areas \
  --table=public.availability_slots \
  > sql/seed_demo_data.sql
```

Перед коммитом проверьте, что seed не содержит персональные данные.

## SQL-инвентаризация

Запрос [export_required_database_objects.sql](export_required_database_objects.sql) возвращает определения требуемых функций и список колонок основных таблиц.
