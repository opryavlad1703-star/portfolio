export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        const { name, contact, message } = req.body || {};

        if (!name || !contact || !message) {
            return res.status(400).json({ success: false, error: 'Усі поля обов’язкові' });
        }

        const BOT_TOKEN = '9099488216:AAGF1hwuUq3NdUQyiS_AfZ02ST-ZZ12YHk';
        const CHAT_ID = '1045628392';

        const text = `🕹 Нова трансляція з портфоліо!\n\n👤 Гравець/Ім'я: ${name}\n💬 Контакт: ${contact}\n📝 Повідомлення: ${message}`;
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const telegramResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        const data = await telegramResponse.json();

        if (!telegramResponse.ok) {
            return res.status(500).json({ success: false, error: data.description || 'Telegram API Error' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}