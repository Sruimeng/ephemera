/**
 * API 类型定义
 * 对应 Rust 后端数据结构
 * @see llmdoc/guides/daily-world-api-quick-ref.md
 */

/**
 * 新闻条目
 */
export interface NewsItem {
  /** 新闻标题 */
  title: string;
  /** 新闻内容 */
  content: string;
}

/**
 * 后端原始响应 (对应 Rust Struct)
 * API: GET https://api.sruim.xin/api/daily-world
 */
export interface DailyWorldData {
  /** 日期 "YYYY-MM-DD" */
  date: string;
  /** 新闻列表 */
  news: NewsItem[];
  /** 哲学评判 */
  philosophy: string;
  /** 3D 物体描述 (英文) */
  object_description: string;
  /** GLB 模型 URL (可能为空或 http) */
  model_url: string;
}

/**
 * 前端规范化类型
 * 统一字段命名，处理 http -> https 转换
 */
export interface NormalizedDailyWorld {
  /** 日期 "YYYY-MM-DD" */
  date: string;
  /** 今日主题 (从 object_description 提取) */
  theme: string;
  /** 哲学总结 */
  summary: string;
  /** 新闻列表 */
  news: NewsItem[];
  /** GLB 模型 URL (已转 https) */
  modelUrl: string;
  /** 生成模型的 Prompt (object_description) */
  tripoPrompt: string;
}

/**
 * API 错误响应
 */
export interface ApiError {
  error: {
    code: 'not_found' | 'invalid_date' | 'db_error';
    message: string;
  };
}

/**
 * useDailyWorld Hook 返回类型
 */
export interface UseDailyWorldResult {
  data: NormalizedDailyWorld | null;
  loading: boolean;
  error: Error | null;
}
