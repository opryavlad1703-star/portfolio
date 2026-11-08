export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Відсутні змінні середовища TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID');
      return res.status(500).json({
        success: false,
        error: 'Сервер не налаштований. Спробуйте пізніше.'
      });
    }

    const { name, contact, message } = req.body || {};

    if (!name || !contact || !message) {
      return res.status(400).json({ success: false, error: 'Усі поля обов’язкові' });
    }

    const cleanName = String(name).slice(0, 100);
    const cleanContact = String(contact).slice(0, 150);
    const cleanMessage = String(message).slice(0, 3000);

    const text =
      `🎮 Нова трансляція з портфоліо!\n\n` +
      `👤 Гравець/Ім'я: ${cleanName}\n` +
      `💬 Контакт: ${cleanContact}\n` +
      `📝 Повідомлення: ${cleanMessage}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text
        })
      }
    );

    const data = await telegramResponse.json().catch(() => ({}));

    if (!telegramResponse.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return res.status(500).json({
        success: false,
        error: data.description || 'Telegram API Error'
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}