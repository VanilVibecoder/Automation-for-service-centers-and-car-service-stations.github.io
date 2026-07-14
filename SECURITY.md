# Security Policy

## Публичные данные

Workflow JSON в этом репозитории обезличены:

- удалены credential references;
- удалён instance ID n8n;
- удалены исходные workflow ID;
- реальные operator chat/user ID заменены placeholders;
- execution data и customer messages не публикуются.

## Никогда не добавляйте в репозиторий

- Telegram bot token;
- пароль PostgreSQL;
- Supabase service-role/anon key, если он не предназначен для клиента;
- реальные chat ID и user ID;
- персональные данные клиентов;
- production `.env`;
- HTTP authorization headers;
- SQL dumps с таблицами `customers`, `messages`, `conversations`, `service_requests`.

## Сообщение об уязвимости

Не создавайте публичный issue с токеном, паролем или персональными данными. Свяжитесь с владельцем репозитория через GitHub-профиль и передайте только описание проблемы без секретов.

## Ротация

При случайной публикации секрета:

1. немедленно отозвать/сменить секрет;
2. удалить его из текущей версии;
3. очистить Git history;
4. проверить логи использования;
5. обновить credentials в n8n.
