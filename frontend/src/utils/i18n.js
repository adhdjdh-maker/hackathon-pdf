import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      rus: {
        translation: {
            roadmap: {
            title: "Планы развития",
            year: "2026",
            active_status: "В разработке",
            q1: {
              title: "Фундамент и AI Ядро",
              items: ["Запуск нейронного ядра QazZerep v2.0", "Интеграция с локальными базами данных", "Обновление 3D-интерфейса"]
            },
            q2: {
              title: "Мультиформатный анализ",
              items: ["Поддержка анализа видео и аудио", "Расширение языковых моделей (KZ, RU, EN, TR)", "API для корпоративных клиентов"]
            },
            q3: {
              title: "Глобальная связность",
              items: ["Запуск мобильного приложения", "Blockchain-верификация отчетов", "Коллаборация с вузами РК"]
            },
            q4: {
              title: "Автономная экосистема",
              items: ["Self-learning AI (дообучение)", "Прогноз академических трендов", "Глобальный поиск по архивам"]
            }
          },
        auth: {
            login_title: "Авторизация",
            login_btn: "Вход в систему",
            email_label: "System Email",
            pass_label: "Access Key",
            terminal_version: "Secure Terminal v2.4",
            no_account: "Нет доступа?",
            create_id: "Создать ID узла",
            error_invalid: "ACCESS_DENIED: НЕВЕРНЫЕ ДАННЫЕ"
            },
          nav: { check: "Проверка", history: "История", account: "Аккаунт", roadmap: "Планы 2026" },
          settings: { language: "Язык системы", theme: "Тема оформления" },
          dash: { 
            title_new: "Сверка документов", 
            subtitle_new: "Интеллектуальный анализ сходства текстов",
            title_history: "Архив проверок",
            subtitle_history: "История ваших предыдущих анализов",
            btn_reset: "Сбросить и начать заново"
          },
          upload: {
            title: "Перетащите файлы сюда",
            formats: "Поддерживаются PDF, DOCX и TXT",
            selected: "Выбрано",
            btn_start: "Запустить анализ"
          },
          report: {
            title: "Отчет анализа",
            match_label: "Сходство",
            source_a: "Источник А",
            target_b: "Источник Б",
            ai_prob: "Вероятность ИИ",
            copied: "Скопировано",
          },
          profile: {
            title: "Настройки узла",
            save_btn: "Сохранить",
            syncing: "Синхронизация",
            config_synced: "КОНФИГ_СИНХРОНИЗИРОВАН",
            upload_failed: "ОШИБКА_ЗАГРУЗКИ",
            avatar_updated: "АВАТАР_ОБНОВЛЕН",
            public_name: "Публичное имя",
            contact_email: "Контактный Email",
            node_active: "Узел активен",
            cloud_sync: "Синхронизация с облачным ядром активна",
            detectors: "Детекторы заимствований",
            ignore_quotes: "Игнорировать цитаты",
            smart_quotes: "Умное распознавание цитат",
            change_pass: "Сменить пароль",
            logout: "Выйти из системы",
            rules: {
              gost: "Литература (ГОСТ)",
              apa: "Библиография (APA/MLA)",
              tables: "Таблицы и графики",
              titles: "Титульный лист"
            }
          },
          footer: {
            description: "Автоматизированная система интеллектуальной сверки протоколов и документации.",
            engine_name: "Движок Интеллект-Сверки",
            sections: {
              nav: { title: "Навигатор" },
              legal: { title: "Правовой узел" },
              support: { title: "Поддержка" }
            }
          },
          info: {
            back: "Назад",
            version_desc: "Подробные спецификации и регламенты работы платформы QazZerep версии 2.4.0.",
            copyright: "© 2026 Инфраструктура Ядра",
            categories: {
              architecture: "Системная Архитектура", methodology: "Методология Данных",
              privacy: "Конфиденциальность", legal: "Юридическая База",
              technical: "Техническая Сессия", manual: "Руководство", channels: "Прямые Каналы"
            },
            pages: {
              doc: { title: "Documentation" }, base: { title: "Global Index" },
              priv: { title: "Security Protocol" }, terms: { title: "Terms of Use" },
              cookie: { title: "Cookie Policy" }, help: { title: "Support Center" }, contacts: { title: "Contact Nodes" }
            },
            content: {
              doc: {
                items: [
                  { t: 'PyMuPDF (fitz) Stream Engine', d: 'Ядро использует высокопроизводительную библиотеку fitz для прямого доступа к бинарным структурам PDF. Текст извлекается в виде потока байтов, минуя сохранение на диск.' },
                  { t: 'Динамический K-Shingling', d: 'Алгоритм разбивает текст на пересекающиеся последовательности. Параметр k=3..9 позволяет системе находить не только прямое копирование, но и умный рерайт.' },
                  { t: 'MD5 Fingerprinting', d: 'Генерация 128-битных отпечатков сегментов. Позволяет сравнивать документы через сопоставление цифровых сигнатур в RAM.' },
                  { t: 'Индекс Сходства Жаккара', d: 'Математическая модель расчета пересечения множеств хешей, обеспечивающая эталонную точность вычисления уникальности.' },
                  { t: 'Batch Cross-Check (O(n²))', d: 'Пакетная сверка всех загруженных файлов между собой для выявления скрытых сетей передачи работ.' },
                  { t: 'Asynchronous FastAPI Backend', d: 'Асинхронность на базе Python asyncio поддерживает стабильный пинг даже при анализе тяжелых массивов данных.' },
                  { t: 'Neural Highlight Engine', d: 'Визуализация через CSS-движок: .diff-match подсвечивает плагиат, а .diff-rewrite отмечает зоны обфускации.' },
                  { t: 'RAM-Only Processing', d: 'Вычисления происходят в волатильной памяти. После сессии объекты уничтожаются, не оставляя следов на диске.' }
                ]
              },
              base: {
                items: [
                  { t: 'Локальный Архив ВУЗов', d: 'Централизованная база всех загруженных работ студентов РК для выявления горизонтального плагиата.' },
                  { t: 'Open Access Crawling', d: 'Индексация репозиториев arXiv.org, Google Scholar и ResearchGate для поиска в научных публикациях.' },
                  { t: 'KazNet Deep Index', d: 'Собственный робот QazBot индексирует гос. порталы и архивы диссертаций на казахском и русском языках.' },
                  { t: 'Cross-Language Mapping', d: 'Технология перевода сегментов текста для поиска заимствований с английского языка на казахский/русский.' },
                  { t: 'GitHub & Code Analysis', d: 'Анализ программного кода (50+ языков) для проверки технических работ на плагиат из репозиториев.' },
                  { t: 'AI Content Patterns', d: 'Статистический анализ текстов на наличие признаков генерации нейросетями (GPT-4, Claude).' }
                ]
              },
              priv: {
                items: [
                  { t: 'Суверенитет Данных РК', d: 'Все серверные мощности расположены в сертифицированных дата-центрах на территории Республики Казахстан.' },
                  { t: 'Шифрование AES-GCM-256', d: 'Каналы передачи данных защищены военным стандартом шифрования. Ваши документы недоступны для перехвата.' },
                  { t: 'Stateless Архитектура', d: 'Система не сохраняет историю загрузок без требования пользователя. Каждый акт проверки эфемерный.' },
                  { t: 'JWT-Авторизация', d: 'Доступ защищен токенами с ограниченным временем жизни, что предотвращает угон сессий.' },
                  { t: 'ISO 27001 Compliance', d: 'Внутренние процессы управления данными соответствуют международным стандартам безопасности.' },
                  { t: 'Право на Забвение', d: 'Пользователь может в один клик удалить все свои следы, включая хешированные отпечатки работ.' }
                ]
              },
              terms: {
                items: [
                  { t: 'Акцепт Соглашения', d: 'Использование сервиса означает принятие условий. Ответственность за интерпретацию результатов лежит на пользователе.' },
                  { t: 'Интеллектуальная Собственность', d: 'Алгоритмы принадлежат QazZerep. Пользователь сохраняет права на загружаемый контент.' },
                  { t: 'Добросовестное Использование', d: 'Запрещается использование ботов для обхода ограничений системы или проведения атак.' },
                  { t: 'Ограничение Ответственности', d: 'Система предоставляет вероятностную оценку. Мы не гарантируем 100% выявление всех форм нейро-обфускации.' }
                ]
              },
              cookie: {
                items: [
                  { t: 'Session Persistence', d: 'Используем технические куки для JWT-авторизации, чтобы не вводить пароль при обновлении.' },
                  { t: 'Security Tokens', d: 'Анти-фрод файлы помогают идентифицировать подозрительную активность и защищать аккаунт.' },
                  { t: 'Zero Third-Party Tracking', d: 'Мы не используем маркетинговые куки. Ваша активность не передается рекламным сетям.' },
                  { t: 'LocalStorage Usage', d: 'Данные о прогрессе анализа могут временно храниться в браузере для восстановления сессии.' }
                ]
              },
              help: {
                items: [
                  { t: 'Инструкция по загрузке', d: 'Рекомендуется PDF с текстовым слоем. Для сканов работает модуль Anti-OCR.' },
                  { t: 'Интерпретация отчета', d: '80%+ — норма. Ниже 50% — критическая зона, требующая ручной проверки.' },
                  { t: 'Технические лимиты', d: 'Максимальный размер файла — 50MB. Для Big Data свяжитесь с отделом интеграции.' }
                ]
              },
              contacts: {
                items: [
                  { t: 'Telegram Support', d: 'Оперативная связь: @brjxjxjd (Ответ в течение 5 минут).' },
                  { t: 'Phone Hotline', d: 'Горячая линия для экстренных вопросов: +7 (777) 123-45-67 (24/7).' }
                ]
              }
            }
          }
        }
      },
      kaz: {
        translation: {
            roadmap: {
            title: "Даму жоспары",
            year: "2026",
            active_status: "Әзірлеу үстінде",
            q1: {
              title: "Іргетас және AI Ядросы",
              items: ["QazZerep v2.0 нейрондық ядросын іске қосу", "Жергілікті деректер базаларымен интеграция", "3D интерфейсін жаңарту"]
            },
            q2: {
              title: "Мультиформатты талдау",
              items: ["Бейне және аудио талдауды қолдау", "Тілдік модельдерді кеңейту (KZ, RU, EN, TR)", "Корпоративтік клиенттерге арналған API"]
            },
            q3: {
              title: "Жаһандық байланыс",
              items: ["Мобильді қолданбаны іске қосу", "Есептерді Blockchain арқылы тексеру", "ҚР жоғары оқу орындарымен ынтымақтастық"]
            },
            q4: {
              title: "Автономды экожүйе",
              items: ["Self-learning AI (өзін-өзі оқыту)", "Академиялық трендтерді болжау", "Мұрағаттар бойынша жаһандық іздеу"]
            }
          },
            auth: {
  login_title: "Авторизация",
  login_btn: "Жүйеге кіру",
  email_label: "System Email",
  pass_label: "Access Key",
  terminal_version: "Secure Terminal v2.4",
  no_account: "Кіру мүмкін емес пе?",
  create_id: "Түйін ID-ін жасау",
  error_invalid: "ACCESS_DENIED: ҚАТЕ ДЕРЕКТЕР"
},
          nav: { check: "Тексеру", history: "Тарих", account: "Аккаунт", roadmap: "Даму жоспары" },
          settings: { language: "Жүйе тілі", theme: "Интерфейс тақырыбы" },
          dash: { 
            title_new: "Құжаттарды салыстыру", 
            subtitle_new: "Мәтіндердің ұқсастығын интеллектуалды талдау",
            title_history: "Тексерулер мұрағаты",
            subtitle_history: "Алдыңғы талдауларыңыздың тарихы",
            btn_reset: "Тазалау және қайта бастау"
          },
          upload: {
            title: "Файлдарды осы жерге сүйреңіз",
            formats: "PDF, DOCX және TXT қолданылады",
            selected: "Таңдалды",
            btn_start: "Талдауды бастау"
          },
          report: {
            title: "Талдау есебі", match_label: "Ұқсастық", source_a: "А дереккөзі",
            target_b: "Б дереккөзі", ai_prob: "ИИ ықтималдығы", copied: "Көшірілді",
          },
          profile: {
            title: "Түйін параметрлері", save_btn: "Сақтау", syncing: "Синхрондау",
            config_synced: "КОНФИГ_СИНХРОНДАЛДЫ", upload_failed: "ЖҮКТЕУ_ҚАТАСЫ",
            avatar_updated: "АВАТАР_ЖАҢАРТЫЛДЫ", public_name: "Жалпыға ортақ есім",
            contact_email: "Байланыс Email-ы", node_active: "Түйін белсенді",
            cloud_sync: "Бұлтты ядромен синхрондау белсенді", detectors: "Ұқсастық детекторы",
            ignore_quotes: "Дәйексөздерді елемеу", smart_quotes: "Дәйексөздерді ақылды тану",
            change_pass: "Құпия сөзді өзгерту", logout: "Жүйеден шығу",
            rules: { gost: "Әдебиет (ГОСТ)", apa: "Библиография (APA/MLA)", tables: "Кестелер", titles: "Титул парағы" }
          },
          footer: {
            description: "Хаттамалар мен құжаттарды интеллектуалды салыстырудың автоматтандырылған жүйесі.",
            engine_name: "Интеллект-Салыстыру Жүйесі",
            sections: { nav: { title: "Навигатор" }, legal: { title: "Құқықтық орталық" }, support: { title: "Қолдау" } }
          },
          info: {
            back: "Артқа",
            version_desc: "QazZerep 2.4.0 платформасының егжей-тегжейлі сипаттамалары мен жұмыс ережелері.",
            copyright: "© 2026 Ядролық Инфрақұрылым",
            categories: {
              architecture: "Жүйе Архитектурасы", methodology: "Деректер Әдістемесі",
              privacy: "Құпиялылық", legal: "Құқықтық Негіз",
              technical: "Техникалық Сессия", manual: "Нұсқаулық", channels: "Тікелей Арналар"
            },
            pages: {
              doc: { title: "Құжаттама" }, base: { title: "Жалпы Индекс" },
              priv: { title: "Қауіпсіздік Хаттамасы" }, terms: { title: "Пайдалану Шарттары" },
              cookie: { title: "Cookie Саясаты" }, help: { title: "Көмек Орталығы" }, contacts: { title: "Байланыс Түйіндері" }
            },
            content: {
              doc: {
                items: [
                  { t: 'PyMuPDF (fitz) Stream Engine', d: 'Ядро PDF бинарлық құрылымдарына тікелей қол жеткізу үшін жоғары өнімді fitz кітапханасын пайдаланады. Мәтін байт ағыны түрінде алынады.' },
                  { t: 'Динамикалық K-Shingling', d: 'Алгоритм мәтінді ақылды рерайтты іздеу үшін қиылысатын тізбектерге бөледі.' },
                  { t: 'MD5 Fingerprinting', d: 'RAM-дағы сандық қолтаңбаларды салыстыру үшін сегменттердің 128 биттік таңбаларын жасау.' },
                  { t: 'Жаккар ұқсастық индексі', d: 'Бірегейлікті есептеудің эталондық дәлдігін қамтамасыз ететін хэш жиындарының қиылысуын есептеудің математикалық моделі.' },
                  { t: 'Batch Cross-Check', d: 'Жұмыстарды берудің жасырын желілерін анықтау үшін барлық жүктелген файлдарды өзара пакеттік салыстыру.' },
                  { t: 'RAM-Only Processing', d: 'Есептеулер тұрақсыз жадта жүреді. Сессиядан кейін нысандар ізсіз жойылады.' }
                ]
              },
              base: {
                items: [
                  { t: 'ЖОО-лардың жергілікті мұрағаты', d: 'Көлденең плагиатты анықтау үшін ҚР студенттерінің барлық жүктелген жұмыстарының орталықтандырылған базасы.' },
                  { t: 'Open Access Crawling', d: 'Ғылыми жарияланымдардан іздеу үшін arXiv.org, Google Scholar және ResearchGate репозиторийлерін индекстеу.' },
                  { t: 'KazNet Deep Index', d: 'Жеке QazBot роботы мемлекеттік порталдарды және қазақ/орыс тілдеріндегі диссертациялар мұрағатын индекстейді.' },
                  { t: 'Cross-Language Mapping', d: 'Ағылшын тілінен қазақ/орыс тілдеріне аударылған мәтін үзінділерін іздеу технологиясы.' }
                ]
              }
            }
          }
        }
      },
      eng: {
        translation: {
            roadmap: {
            title: "Project Roadmap",
            year: "2026",
            active_status: "Active Development",
            q1: {
              title: "Foundation & AI Core",
              items: ["QazZerep v2.0 Neural Core Launch", "Local Database Integration", "3D Interface Update"]
            },
            q2: {
              title: "Multi-Format Analysis",
              items: ["Video & Audio Analysis Support", "LLM Expansion (KZ, RU, EN, TR)", "Enterprise API Access"]
            },
            q3: {
              title: "Global Connectivity",
              items: ["Mobile App Launch (iOS/Android)", "Blockchain Report Verification", "University Partnerships in RK"]
            },
            q4: {
              title: "Autonomous Ecosystem",
              items: ["Self-learning AI Implementation", "Academic Trend Prediction", "Global Archive Search"]
            }
          },
            auth: {
  login_title: "Authorization",
  login_btn: "Login to System",
  email_label: "System Email",
  pass_label: "Access Key",
  terminal_version: "Secure Terminal v2.4",
  no_account: "No access?",
  create_id: "Create Node ID",
  error_invalid: "ACCESS_DENIED: INVALID CREDENTIALS"
},
          nav: { check: "Verification", history: "History", account: "Account", roadmap: "Roadmap" },
          settings: { language: "System Language", theme: "Visual Theme" },
          dash: { 
            title_new: "Document Sync", 
            subtitle_new: "Intelligent text similarity analysis",
            title_history: "Audit Archive",
            subtitle_history: "History of your previous scans",
            btn_reset: "Reset Core"
          },
          upload: {
            title: "Drop layers here",
            formats: "PDF, DOCX, TXT supported",
            selected: "Active",
            btn_start: "Execute Analysis"
          },
          report: {
            title: "Analysis Report", match_label: "Similarity", source_a: "Source A",
            target_b: "Source B", ai_prob: "AI Probability", copied: "Copied",
          },
          profile: {
            title: "Node Settings", save_btn: "Save Config", syncing: "Syncing",
            config_synced: "CONFIG_SYNCED", upload_failed: "UPLOAD_FAILED",
            avatar_updated: "AVATAR_UPDATED", public_name: "Public Name",
            contact_email: "Contact Email", node_active: "Node Active",
            cloud_sync: "Cloud Core Sync Active", detectors: "Detectors",
            ignore_quotes: "Ignore Quotes", smart_quotes: "Smart Quotes",
            change_pass: "Password", logout: "Logout",
            rules: { gost: "GOST Lit", apa: "APA/MLA", tables: "Tables", titles: "Titles" }
          },
          footer: {
            description: "Automated system for intelligent reconciliation of protocols and documentation.",
            engine_name: "Intellect-Sverka Engine",
            sections: { nav: { title: "Navigator" }, legal: { title: "Legal Node" }, support: { title: "Support" } }
          },
          info: {
            back: "Return",
            version_desc: "Detailed specifications and operational protocols for QazZerep v2.4.0.",
            copyright: "© 2026 Core Infrastructure",
            categories: {
              architecture: "System Architecture", methodology: "Data Methodology",
              privacy: "Data Privacy", legal: "Legal Framework",
              technical: "Technical Session", manual: "User Manual", channels: "Direct Channels"
            },
            pages: {
              doc: { title: "Documentation" }, base: { title: "Global Index" },
              priv: { title: "Security Protocol" }, terms: { title: "Terms of Use" },
              cookie: { title: "Cookie Policy" }, help: { title: "Support Center" }, contacts: { title: "Contact Nodes" }
            },
            content: {
              doc: {
                items: [
                  { t: 'PyMuPDF (fitz) Stream Engine', d: 'Core uses high-performance fitz library for direct access to PDF binary structures. Text is extracted as byte stream.' },
                  { t: 'Dynamic K-Shingling', d: 'Algorithm splits text into overlapping sequences to detect smart rewriting.' },
                  { t: 'MD5 Fingerprinting', d: '128-bit segment hashing for digital signature matching in RAM.' },
                  { t: 'Jaccard Similarity Index', d: 'Mathematical model for calculating hash set intersections, ensuring reference uniqueness accuracy.' },
                  { t: 'Asynchronous FastAPI Backend', d: 'Asynchrony based on Python asyncio supports stable ping even when analyzing heavy data arrays.' },
                  { t: 'RAM-Only Processing', d: 'Computations occur in volatile memory. Objects are destroyed post-session.' }
                ]
              },
              base: {
                items: [
                  { t: 'Local University Archive', d: 'Centralized database of all uploaded works by RK students to detect horizontal plagiarism.' },
                  { t: 'Open Access Crawling', d: 'Indexing of arXiv.org, Google Scholar, and ResearchGate repositories for search in scientific publications.' },
                  { t: 'KazNet Deep Index', d: 'Proprietary QazBot robot indexes government portals and dissertation archives.' },
                  { t: 'AI Content Patterns', d: 'Statistical analysis of texts for signs of generation by neural networks (GPT-4, Claude).' }
                ]
              }
            }
          }
        }
      }
    },
    fallbackLng: 'rus',
    interpolation: { escapeValue: false }
  });

export default i18n;
