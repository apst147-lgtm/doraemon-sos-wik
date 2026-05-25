import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ฟังก์ชัน cn สำหรับรวม Tailwind classes 
 * และจัดการกรณีที่มี class ขัดแย้งกัน (conflict) อย่างชาญฉลาด
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}