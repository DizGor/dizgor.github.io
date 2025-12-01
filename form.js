// form.js — отправка заявки в Telegram через скрытые env-переменные с маской телефона и автоматическим форматированием

(async function(){
  // Загружаем ENV-файл
  const env = await fetch('telegram.env').then(r => r.text()).catch(()=>'');
  const TELEGRAM_BOT_TOKEN = env.match(/TELEGRAM_BOT_TOKEN=(.*)/)?.[1]?.trim();
  const TELEGRAM_CHAT_ID = env.match(/TELEGRAM_CHAT_ID=(.*)/)?.[1]?.trim();

  if(!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID){
    console.warn('ENV file not loaded — Telegram sending disabled');
  }

  const form = document.getElementById('leadForm');
  const msg  = document.getElementById('formMsg');
  const phoneField = document.getElementById('phone');
  const addressField = document.getElementById('address');

  // Добавляем placeholder для комментария
  addressField.placeholder = "Не обов'язково";

  // PHONE INPUT MASK +380 (XX) XXX XX XX с автоматическим форматированием
  phoneField.addEventListener('input', function(e){
    let x = phoneField.value.replace(/\D/g, '').substring(0,12);
    let formatted = '+380 '; 
    if(x.length > 3) formatted += '(' + x.substring(3,5) + ') '; 
    if(x.length >= 6) formatted += x.substring(5,8) + ' '; 
    if(x.length >= 8) formatted += x.substring(8,10) + ' '; 
    if(x.length >= 10) formatted += x.substring(10,12);
    phoneField.value = formatted.trim();
  });

  phoneField.addEventListener('paste', function(e){
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    const digits = pasted.replace(/\D/g,'').substring(0,12);
    let formatted = '+380 '; 
    if(digits.length > 3) formatted += '(' + digits.substring(3,5) + ') '; 
    if(digits.length >= 6) formatted += digits.substring(5,8) + ' '; 
    if(digits.length >= 8) formatted += digits.substring(8,10) + ' '; 
    if(digits.length >= 10) formatted += digits.substring(10,12);
    phoneField.value = formatted.trim();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // PHONE VALIDATION FOR +380 (XX) XXX XX XX
    const phone = phoneField.value.trim();
    const phoneRegex = /^\+380 \(\d{2}\) \d{3} \d{2} \d{2}$/;
    if (!phoneRegex.test(phone)) {
      alert('Введіть номер телефону у форматі +380 (12) 333 44 55');
      phoneField.focus();
      return;
    }

    const data = {
      name: document.getElementById('name').value.trim(),
      phone: phone,
      address: addressField.value.trim(),
      service: document.getElementById('service').value,
      when: document.getElementById('when').value.trim(),
      created_at: new Date().toLocaleString('uk-UA')
    };

    const text = `🛠 *Нова заявка з сайту Вінниця*\n\n👤 Ім'я: ${data.name}\n📞 Телефон: ${data.phone}\n📍 Адреса: ${data.address || '-'}\n🔧 Послуга: ${data.service}\n⏱ Коли зручно: ${data.when || '-'}\n\n📅 Час: ${data.created_at}`;

    if(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID){
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text, parse_mode: 'Markdown' })
      }).catch(err => console.error('Telegram error:', err));
    } else {
      console.warn('Telegram отправка отключена — нет токена или chat_id');
    }

    msg.classList.remove('d-none');
    form.reset();
    setTimeout(()=> msg.classList.add('d-none'), 4000);
  });
})();
