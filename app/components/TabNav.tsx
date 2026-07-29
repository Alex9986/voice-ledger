'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: '账单', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { href: '/chat', label: 'AI 对话', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  ];

  return (
    <nav className="flex gap-0" style={{ marginTop: '2px' }}>
      {tabs.map((tab) => {
        const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="relative flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-all duration-300"
            style={{
              color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-white"
                style={{
                  width: '60%',
                  animation: 'scale-in 0.3s ease-out',
                  boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
