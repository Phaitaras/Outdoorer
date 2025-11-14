import React from 'react';
import { Badge, BadgeText } from '@/components/ui/badge';
import type { Sentiment } from './sentiment';

const BG: Record<Sentiment, string> = {
  IDEAL: 'bg-[#2BD57633]', GREAT: 'bg-[#78E08F33]',
  GOOD:  'bg-[#FFD16633]', FAIR:  'bg-[#FF914D33]',
  BAD:   'bg-[#FF5C5C33]',
};
const TXT: Record<Sentiment, string> = {
  IDEAL: 'text-[#12B264]', GREAT: 'text-[#2EAF62]',
  GOOD:  'text-[#D49C00]', FAIR:  'text-[#C86722]',
  BAD:   'text-[#C53030]',
};

export function StatusBadge({ value }: { value: Sentiment }) {
  return (
    <Badge size="sm" className={`rounded-md border-0 ${BG[value]}`}>
      <BadgeText className={` ${TXT[value]}`}>{value}</BadgeText>
    </Badge>
  );
}
