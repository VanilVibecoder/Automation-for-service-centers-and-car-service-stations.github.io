-- Инвентаризация объектов БД для портфолио-проекта.
-- Запустите в Supabase SQL Editor или PostgreSQL.
-- Результаты сохраните в отдельные файлы после проверки персональных данных.

-- 1. Требуемые функции
SELECT
    p.proname AS function_name,
    pg_get_function_identity_arguments(p.oid) AS arguments,
    pg_get_functiondef(p.oid) AS definition
FROM pg_proc AS p
JOIN pg_namespace AS n
    ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname = ANY (
      ARRAY[
          'ingest_channel_event',
          'claim_conversation_turn',
          'merge_request_draft',
          'create_clarification_response',
          'create_slot_offer_response',
          'hold_selected_slot_response',
          'submit_confirmed_request_response',
          'change_slot_response',
          'cancel_draft_response',
          'reopen_draft_for_edit_response',
          'handle_service_resolution_fallback',
          'handle_human_request_response',
          'create_unsafe_handoff_response',
          'create_unsupported_input_response',
          'apply_operator_handoff_action'
      ]::text[]
  )
ORDER BY p.proname, arguments;

-- 2. Колонки основных таблиц
SELECT
    table_name,
    ordinal_position,
    column_name,
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = ANY (
      ARRAY[
          'organizations',
          'customers',
          'conversations',
          'messages',
          'service_catalog',
          'service_areas',
          'availability_slots',
          'slot_holds',
          'service_requests'
      ]::text[]
  )
ORDER BY table_name, ordinal_position;

-- 3. Ограничения
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    pg_get_constraintdef(pc.oid, TRUE) AS definition
FROM information_schema.table_constraints AS tc
JOIN pg_constraint AS pc
    ON pc.conname = tc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name = ANY (
      ARRAY[
          'organizations',
          'customers',
          'conversations',
          'messages',
          'service_catalog',
          'service_areas',
          'availability_slots',
          'slot_holds',
          'service_requests'
      ]::text[]
  )
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;
