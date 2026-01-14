'use client';

/**
 * Filter Selector
 * @description 滤镜选择器组件 - PC端点击切换，移动端滑动切换
 */

import { STYLE_FILTERS, useStyleFilter, type StyleFilter } from '@/components/post-processing';
import { animate, motion, useMotionValue, type PanInfo } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** 滤镜 ID 到国际化 key 的映射 */
const FILTER_I18N_KEYS = {
  default: 'filter.default',
  blueprint: 'filter.blueprint',
  halftone: 'filter.halftone',
  ascii: 'filter.ascii',
  pixel: 'filter.pixel',
  sketch: 'filter.sketch',
  glitch: 'filter.glitch',
  crystal: 'filter.crystal',
  claymation: 'filter.claymation',
} as const satisfies Record<StyleFilter, string>;

/** 单个滑块项高度 */
const ITEM_HEIGHT = 44;

/** 滤镜特征图标 */
function FilterIcon({ filterId }: { filterId: StyleFilter }) {
  const baseClass = 'w-full h-full rounded-sm';

  switch (filterId) {
    case 'default':
      return (
        <div className={`${baseClass} from-neutral-700 to-neutral-900 bg-gradient-to-br`}>
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]/60" />
          </div>
        </div>
      );
    case 'blueprint':
      return (
        <div className={`${baseClass} bg-[#0a1628]`}>
          <div className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px opacity-60">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-cyan-500/40" />
              ))}
            </div>
          </div>
        </div>
      );
    case 'halftone':
      return (
        <div className={`${baseClass} bg-[#f5f0e6]`}>
          <div className="h-full w-full flex flex-wrap items-center justify-center gap-0.5 p-0.5">
            {[1, 0.7, 0.4, 0.7, 1, 0.7, 0.4, 0.7, 1].map((opacity, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-neutral-800" style={{ opacity }} />
            ))}
          </div>
        </div>
      );
    case 'ascii':
      return (
        <div className={`${baseClass} bg-black`}>
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-[5px] text-green-500 leading-none font-mono">{'>'}_</span>
          </div>
        </div>
      );
    case 'pixel':
      return (
        <div className={`${baseClass} overflow-hidden bg-neutral-900`}>
          <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: [1, 4, 7].includes(i)
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'transparent',
                }}
              />
            ))}
          </div>
        </div>
      );
    case 'sketch':
      return (
        <div className={`${baseClass} bg-[#faf8f5]`}>
          <svg viewBox="0 0 24 24" className="h-full w-full p-0.5">
            <path
              d="M6 18 L12 6 L18 18"
              fill="none"
              stroke="#333"
              strokeWidth="1"
              strokeLinecap="round"
              style={{ strokeDasharray: '2 1' }}
            />
          </svg>
        </div>
      );
    case 'glitch':
      return (
        <div className={`${baseClass} overflow-hidden bg-black`}>
          <div className="h-full w-full flex flex-col justify-center gap-0.5">
            <div className="h-0.5 translate-x-0.5 bg-red-500/70" />
            <div className="h-0.5 bg-cyan-500/70 -translate-x-0.5" />
            <div className="h-0.5 translate-x-1 bg-green-500/70" />
          </div>
        </div>
      );
    case 'crystal':
      return (
        <div className={`${baseClass} from-purple-900/50 to-blue-900/50 bg-gradient-to-br`}>
          <div className="h-full w-full flex items-center justify-center">
            <div
              className="h-3 w-2.5 from-white/40 to-purple-400/30 bg-gradient-to-b"
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            />
          </div>
        </div>
      );
    case 'claymation':
      return (
        <div className={`${baseClass} from-orange-200 to-amber-100 bg-gradient-to-br`}>
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full from-orange-400 to-orange-600 bg-gradient-to-br" />
          </div>
        </div>
      );
    default:
      return <div className={baseClass} />;
  }
}

/** 移动端滑动选择器 */
function MobileFilterSelector() {
  const { t } = useTranslation('common');
  const { filter, setFilter } = useStyleFilter();

  const currentIndex = STYLE_FILTERS.findIndex((f) => f.id === filter);
  const [activeIndex, setActiveIndex] = useState(currentIndex >= 0 ? currentIndex : 0);
  const y = useMotionValue(0);

  useEffect(() => {
    const newIndex = STYLE_FILTERS.findIndex((f) => f.id === filter);
    if (newIndex >= 0 && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      animate(y, -newIndex * ITEM_HEIGHT, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [filter, activeIndex, y]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const velocity = info.velocity.y;
      const offset = info.offset.y;

      // 如果是点击操作（位移很小），不进行拖拽结束的处理，交给 onTap 处理
      if (Math.abs(offset) < 5 && Math.abs(velocity) < 5) {
        return;
      }

      let newIndex = activeIndex;

      if (Math.abs(velocity) > 200) {
        newIndex = velocity < 0 ? activeIndex + 1 : activeIndex - 1;
      } else if (Math.abs(offset) > ITEM_HEIGHT / 3) {
        newIndex = offset < 0 ? activeIndex + 1 : activeIndex - 1;
      }

      newIndex = Math.max(0, Math.min(STYLE_FILTERS.length - 1, newIndex));

      setActiveIndex(newIndex);
      setFilter(STYLE_FILTERS[newIndex].id);
      animate(y, -newIndex * ITEM_HEIGHT, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    },
    [activeIndex, setFilter, y],
  );

  const handleItemTap = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setFilter(STYLE_FILTERS[index].id);
      animate(y, -index * ITEM_HEIGHT, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    },
    [setFilter, y],
  );

  const currentLabel = t(FILTER_I18N_KEYS[STYLE_FILTERS[activeIndex]?.id ?? 'default']);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-[88px] w-8 overflow-hidden border border-[#3B82F6]/20 rounded bg-black/40 backdrop-blur-sm">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 h-[44px] border-y border-[#3B82F6]/40 bg-[#3B82F6]/10 -translate-y-1/2" />

        <motion.div
          className="absolute left-0 right-0 cursor-grab active:cursor-grabbing"
          style={{ y, top: '50%', marginTop: -ITEM_HEIGHT / 2 }}
          drag="y"
          dragConstraints={{
            top: -(STYLE_FILTERS.length - 1) * ITEM_HEIGHT,
            bottom: 0,
          }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {STYLE_FILTERS.map((f, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.div
                key={f.id}
                className="flex items-center justify-center"
                style={{ height: ITEM_HEIGHT }}
                onTap={() => handleItemTap(index)}
              >
                <div
                  className={`h-6 w-6 overflow-hidden rounded-sm transition-all duration-200 ${
                    isActive ? 'ring-1 ring-[#3B82F6] scale-110' : 'opacity-50 scale-90'
                  }`}
                >
                  <FilterIcon filterId={f.id} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-4 from-black/60 to-transparent bg-gradient-to-b" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-4 from-black/60 to-transparent bg-gradient-to-t" />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[8px] text-[#A3A3A3] tracking-wider font-mono uppercase">
          {t('hud.filter', 'FILTER')}
        </span>
        <span className="text-[10px] text-[#3B82F6] tracking-wide font-mono">{currentLabel}</span>
      </div>
    </div>
  );
}

/** PC端点击选择器 - 竖向排列，紧凑图标 */
function DesktopFilterSelector() {
  const { filter, setFilter } = useStyleFilter();

  return (
    <div className="flex flex-col gap-0.5 border border-[#3B82F6]/10 rounded bg-black/30 p-1 backdrop-blur-sm">
      {STYLE_FILTERS.map((f) => {
        const isActive = filter === f.id;

        return (
          <motion.button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={` rounded p-0.5 transition-all duration-150 ${isActive ? 'ring-1 ring-[#3B82F6]/60' : 'opacity-60 hover:opacity-100'}  `}
          >
            <div className="h-5 w-5 overflow-hidden rounded-sm">
              <FilterIcon filterId={f.id} />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

/** 主组件：根据设备类型渲染不同选择器 */
export function FilterSelector() {
  const { isMobile } = useStyleFilter();

  if (isMobile) {
    return <MobileFilterSelector />;
  }

  return <DesktopFilterSelector />;
}
