const DNS = '81.90.25.206';
const services = [
  ['Xbox / Game Pass','Игры и экосистема Xbox','⊕','games'],
  ['ChatGPT','ChatGPT и OpenAI','✳','ai'],
  ['Claude','Claude и Anthropic','✺','ai'],
  ['Gemini','Gemini и AI Studio','✦','ai'],
  ['Microsoft Copilot','AI-помощник Microsoft','◈','ai'],
  ['GitHub Copilot','Помощник для разработки','⌘','work'],
  ['JetBrains','Инструменты разработчика','JB','work'],
  ['Framer','Дизайн и создание сайтов','◩','work'],
  ['Spotify','Интерфейс · аудио напрямую','≋','music'],
  ['OpenAI API','API и контент OpenAI','↗','ai']
];
const grid = document.querySelector('#service-grid');
services.forEach(([name, description, mark, category], index) => {
  const card = document.createElement('article'); card.className = 'service-card'; card.dataset.category = category;
  const icon = document.createElement('span'); icon.className = 'service-mark'; icon.setAttribute('aria-hidden','true');
  icon.style.backgroundPosition = `${(index % 5) * 25}% ${index < 5 ? 0 : 100}%`;
  const title = document.createElement('h3'); title.textContent = name;
  const copy = document.createElement('p'); copy.textContent = description;
  card.append(icon,title,copy); grid.append(card);
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  grid.querySelectorAll('article').forEach(card => card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter);
}));
const guides = {
  xbox: {title:'Подключаем Xbox',steps:[
    '<strong>Открой настройки сети.</strong><br>Настройки → Общие → Параметры сети → Дополнительные настройки.',
    '<strong>Выбери ручную настройку DNS.</strong><br>Введи основной DNS: <code>81.90.25.206</code>. Если консоль требует второй адрес, повтори тот же IP — это не резервный сервер.',
    '<strong>Сохрани и проверь подключение.</strong><br>Перезапусти консоль. Выполни проверку сети в настройках Xbox, затем открой нужный сервис.'
  ]},
  windows: {title:'Подключаем Windows',steps:[
    '<strong>Открой свойства активного подключения.</strong><br>Параметры → Сеть и Интернет → Wi-Fi или Ethernet. Найди назначение DNS-сервера и нажми «Изменить».',
    '<strong>Выбери ручной режим и IPv4.</strong><br>Укажи предпочитаемый DNS <code>81.90.25.206</code>. Альтернативный оставь пустым. Для этого адреса используется обычный DNS, без настроенного DoH.',
    '<strong>Сохрани и переподключись к сети.</strong><br>Перезапусти браузер и открой нужный сервис. Собственный защищённый DNS браузера может обходить системную настройку.'
  ]},
  router: {title:'Подключаем домашнюю сеть',steps:[
    '<strong>Открой панель управления роутером.</strong><br>Адрес и данные входа указаны на устройстве или в инструкции производителя.',
    '<strong>Найди настройки DNS для Интернета или DHCP.</strong><br>Укажи <code>81.90.25.206</code> как основной DNS. Второй оставь пустым; если поле обязательно, повтори тот же адрес.',
    '<strong>Сохрани и переподключи устройства.</strong><br>Названия разделов зависят от модели роутера. Проверь настройки IPv6, если часть сервисов продолжает идти другим маршрутом.'
  ]},
  phone: {title:'Подключаем смартфон по Wi-Fi',steps:[
    '<strong>На iPhone.</strong><br>Настройки → Wi-Fi → ⓘ у своей сети → Настройка DNS → Вручную. Сохрани прежние адреса для отката, затем замени их на <code>81.90.25.206</code>.',
    '<strong>На Android.</strong><br>Открой параметры подключённой Wi-Fi-сети. Если DNS доступен только со статическим IP, сохрани текущие IP, шлюз и префикс без изменений; в DNS укажи <code>81.90.25.206</code>. Если не уверен в параметрах, настрой DNS на роутере.',
    '<strong>Переподключись к Wi-Fi.</strong><br>Настройка действует для выбранной сети. Числовой IP не подходит для поля Android «Частный DNS», где требуется имя сервера DoT.'
  ]}
};
const tabs = [...document.querySelectorAll('[data-device]')];
function selectDevice(tab) {
  tabs.forEach(b => {const active=b.dataset.device===tab.dataset.device;b.classList.toggle('selected',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
  const guide=guides[tab.dataset.device];const panel=document.querySelector('#guide');
  panel.setAttribute('aria-labelledby',tab.id);panel.innerHTML=`<h3>${guide.title}</h3><ol>${guide.steps.map(step=>`<li>${step}</li>`).join('')}</ol>`;
  document.querySelector('#setup-cards').setAttribute('aria-labelledby', 'step-tab-' + tab.dataset.device);
  document.querySelector('.setup-device').dataset.currentDevice = tab.dataset.device;
  const summaries = {
    xbox: ['Открой настройки сети', 'Выбери ручную настройку DNS', 'Сохрани настройки и открой сервис'],
    windows: ['Открой параметры сети', 'Найди назначение DNS-сервера', 'Переподключись к сети и открой сервис'],
    router: ['Открой настройки роутера', 'Найди DNS в настройках Интернета', 'Сохрани и переподключи устройства'],
    phone: ['Открой настройки Wi-Fi', 'Выбери свою сеть и параметры DNS', 'Переподключись к Wi-Fi и открой сервис']
  };
  const [title, firstCopy, thirdCopy] = summaries[tab.dataset.device];
  document.querySelector('#step-one-title').textContent = title;
  document.querySelector('#step-one-copy').textContent = firstCopy;
  document.querySelector('#step-three-copy').textContent = thirdCopy;
}
tabs.forEach(tab=>{tab.addEventListener('click',()=>selectDevice(tab));tab.addEventListener('keydown',event=>{
  const group = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
  const index = group.indexOf(tab);
  let next;if(event.key==='ArrowRight')next=(index+1)%group.length;else if(event.key==='ArrowLeft')next=(index+group.length-1)%group.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=group.length-1;else return;
  event.preventDefault();group[next].focus();selectDevice(group[next]);
});});selectDevice(tabs[0]);
let toastTimer;
function toast(message){const node=document.querySelector('#toast');node.textContent=message;node.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('visible'),4000);}
document.querySelector('#copy-dns').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(DNS);toast('DNS скопирован: '+DNS);}catch{toast('Скопируй адрес вручную: '+DNS);const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(document.querySelector('.ip'));selection.removeAllRanges();selection.addRange(range);}
});
