// contacts.js

// 1. Настройка маски телефона (библиотека IMask)
const phoneElement = document.querySelector('input[placeholder="+38 (0XX) XXX-XX-XX"]');
const maskOptions = {
    mask: '+{38} (000) 000-00-00',
    lazy: false // Маска видна сразу
};
const mask = IMask(phoneElement, maskOptions);

// 2. Обработка отправки формы
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = this.querySelector('button');
    const originalBtnText = btn.innerHTML;

    // Проверка: заполнен ли телефон полностью
    if (!mask.masked.isComplete) {
        alert('Пожалуйста, введите номер телефона полностью');
        phoneElement.style.border = '2px solid #e63946'; // Подсветка ошибки
        return;
    } else {
        phoneElement.style.border = ''; // Сброс стиля
    }

    // Загружаем ENV-файл (твой метод)
    const env = await fetch('telegram.env').then(r => r.text()).catch(() => '');
    const TOKEN = env.match(/TELEGRAM_BOT_TOKEN=(.*)/)?.[1]?.trim();
    const CHAT_ID = env.match(/TELEGRAM_CHAT_ID=(.*)/)?.[1]?.trim();

    if (!TOKEN || !CHAT_ID) {
        alert("Ошибка конфигурации Telegram! Проверьте файл telegram.env");
        return;
    }

    // Собираем данные
    const name = this.querySelector('input[placeholder="Иван"]').value;
    const phone = mask.value; // Берем значение из маски
    const address = this.querySelector('input[placeholder*="Днепр"]').value;
    const message = this.querySelector('textarea').value;

    const text = `<b>🚀 Новая заявка JKROVLIA</b>\n\n` +
                 `<b>👤 Имя:</b> ${name}\n` +
                 `<b>📞 Тел:</b> ${phone}\n` +
                 `<b>📍 Объект:</b> ${address}\n` +
                 `<b>📝 Проблема:</b> ${message}`;

    // Состояние загрузки (Зеленый акцент)
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Отправка...';

    try {
        const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: "HTML"
            })
        });

        if (response.ok) {
            // Успешная отправка
            btn.innerHTML = '<i class="fas fa-check me-2"></i> Отправлено!';
            btn.classList.add('btn-success'); // Стандартный зеленый Bootstrap или твой
            btn.style.backgroundColor = '#1abf7b'; // Твой фирменный зеленый
            
            this.reset();
            mask.updateValue(); // Сброс маски

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalBtnText;
                btn.classList.remove('btn-success');
                btn.style.backgroundColor = ''; 
            }, 5000);
        } else {
            throw new Error('Telegram API Error');
        }
    } catch (err) {
        alert("Ошибка отправки! Проверьте соединение.");
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
    }
});