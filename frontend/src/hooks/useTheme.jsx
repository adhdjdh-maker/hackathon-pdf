import { useEffect, useState } from 'react';

export const useTheme = () => {
  // 1. Инициализируем состояние из localStorage или ставим 'system' по умолчанию
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('qazzerep_theme') || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Функция применения темы
    const applyTheme = () => {
      // Проверяем, нужно ли включить темный режим
      const isDark = 
        theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('qazzerep_theme', theme);

    // Слушатель для системной темы (если пользователь поменяет тему в Windows/macOS)
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  return { theme, setTheme };
};
