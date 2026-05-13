"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathname = useRef(pathname);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        anchor.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey
      ) {
        return;
      }
      if (href !== pathname) {
        startProgress();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      finishProgress();
    }
  }, [pathname]);

  function startProgress() {
    clearTimers();
    setLoading(true);
    setProgress(10);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 12;
      });
    }, 300);
  }

  function finishProgress() {
    clearTimers();
    setProgress(100);
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 300);
  }

  function clearTimers() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[9999] h-[3px]">
      <div
        className="h-full bg-brand transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }}
      />
    </div>
  );
}
