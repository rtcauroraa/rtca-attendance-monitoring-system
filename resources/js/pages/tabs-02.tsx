'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

type Movement = {
    id: number;
    type: 'LIBERTY' | 'LEAVE' | 'OFFICIAL_BUSINESS';
    mode: 'ASHORE' | 'ABOARD';
    duration?: number;
    time?: string;
    issued_at: string;
    expires_at?: string;
    returned_at?: string | null;
    status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
};

const TABS = ['LIBERTY', 'LEAVE', 'OFFICIAL_BUSINESS'] as const;

export default function Tabs02({ movements }: { movements: Movement[] }) {
    const [activeTab, setActiveTab] =
        useState<(typeof TABS)[number]>('LIBERTY');

    const filtered = useMemo(() => {
        return movements.filter((m) => m.type === activeTab);
    }, [movements, activeTab]);

    return (
        <div>
            {/* Tabs Header */}
            <div className="mb-4 flex gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'rounded px-3 py-1 text-xs transition',
                            activeTab === tab
                                ? 'bg-black text-white'
                                : 'bg-gray-200 text-gray-700',
                        )}
                    >
                        {tab.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Animated Content */}
            <div className="relative min-h-[120px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        {filtered.length === 0 ? (
                            <p className="text-sm text-gray-500">No records.</p>
                        ) : (
                            <DataTable columns={columns} data={filtered} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
