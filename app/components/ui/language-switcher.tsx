/**
 * LanguageSwitcher 组件
 * HUD 风格语言切换器
 */

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lngs } from '~/locales';

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * HUD 风格语言切换下拉菜单
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLng = Lngs.find((lng) => lng.code === i18n.language) || Lngs[0];

  // 切换语言
  const handleChangeLanguage = useCallback(
    (code: string) => {
      i18n.changeLanguage(code);
      // 保存到 cookie
      document.cookie = `lng=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      setIsOpen(false);
    },
    [i18n],
  );

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border border-white/10 rounded-sm px-3 py-1.5 text-[10px] text-[#A3A3A3] tracking-wider font-mono uppercase transition-all active:scale-95 hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/5 hover:text-[#3B82F6]"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="i-lucide-globe h-3 w-3" />
        <span>{currentLng.label}</span>
        <span
          className={`i-lucide-chevron-down h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[140px] animate-fade-in border border-white/10 rounded-sm bg-[#0A0A0A]/95 py-1 shadow-lg backdrop-blur-sm">
          {Lngs.map((lng) => (
            <button
              key={lng.code}
              onClick={() => handleChangeLanguage(lng.code)}
              className={`
                w-full px-4 py-2 text-left text-xs font-mono transition-colors
                ${lng.code === i18n.language ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'text-[#A3A3A3] hover:bg-white/5 hover:text-[#F5F5F5]'}
              `}
            >
              {lng.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
