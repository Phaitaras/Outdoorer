import { Badge, BadgeText } from '@/components/ui/badge';
import React from 'react';
import type { Sentiment } from './sentiment';

const BG: Record<Sentiment, string> = {
  GREAT: 'bg-[#2BD57633]', GOOD: 'bg-[#78E08F33]',
  FAIR:  'bg-[#FFD16633]', BAD:  'bg-[#FF914D33]',
  POOR:   'bg-[#FF5C5C33]',
};
const TXT: Record<Sentiment, string> = {
  GREAT: 'text-[#12B264]', GOOD: 'text-[#2EAF62]',
  FAIR:  'text-[#D49C00]', BAD:  'text-[#C86722]',
  POOR:   'text-[#C53030]',
};

export function StatusBadge({ value }: { value: Sentiment }) {
  return (
    <Badge size="sm" className={`rounded-md border-0 ${BG[value]}`}>
      <BadgeText className={` ${TXT[value]}`} style={{fontFamily: 'Roboto-Regular'}}>{value}</BadgeText>
    </Badge>
  );
}
