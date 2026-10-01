import React, { useEffect, useState, useCallback } from 'react';
import { Select, Stack, Text, Card, Spinner, Flex, Badge } from '@sanity/ui';
import { StringInputProps, set, unset, useClient } from 'sanity';

interface DynamicChapter {
  _id: string;
  title: string;
  region?: string;
}

const STATIC_CATEGORIES = [
  { group: 'National & Central Boards', items: [
    { title: '🇮🇳 India Chapter — Apex Governing Board', value: 'Board' },
    { title: '🏛️ Advisory Board', value: 'Advisory' },
    { title: '👥 Staff & General Members', value: 'General Member' },
  ]},
  { group: 'Default State Chapters (India)', items: [
    { title: '📍 India Chapter — UP State Chapter', value: 'UP Chapter Team' },
    { title: '📍 India Chapter — Bihar State Chapter', value: 'Bihar Chapter Team' },
    { title: '📍 India Chapter — Assam State Chapter', value: 'Assam Chapter Team' },
    { title: '📍 India Chapter — Gujarat State Chapter', value: 'Gujarat Chapter Team' },
  ]},
  { group: 'Japan Chapter', items: [
    { title: '🇯🇵 Japan Chapter Team', value: 'Japan Chapter Team' },
  ]},
];

export function ChapterCategoryInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props;
  const client = useClient({ apiVersion: '2023-01-01' });
  const [dynamicChapters, setDynamicChapters] = useState<DynamicChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    client
      .fetch<DynamicChapter[]>(
        `*[_type == "chapter" && hidden != true] | order(title asc) { _id, title, region }`
      )
      .then((data) => {
        if (mounted) {
          setDynamicChapters(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching chapters for dropdown:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [client]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
    },
    [onChange]
  );

  // Filter dynamic chapters that aren't duplicates of the static items
  const extraChapters = dynamicChapters.filter((ch) => {
    const t = (ch.title || '').toLowerCase();
    return (
      !t.includes('apex') &&
      !t.includes('board') &&
      !t.includes('advisory') &&
      !t.includes('up chapter') &&
      !t.includes('uttar pradesh') &&
      !t.includes('bihar') &&
      !t.includes('assam') &&
      !t.includes('gujarat') &&
      !t.includes('japan chapter') &&
      !t.includes('think tank') &&
      !t.includes('thinktank')
    );
  });

  // Check if current value matches any option
  const allKnownValues = [
    'Board',
    'Advisory',
    'General Member',
    'UP Chapter Team',
    'Bihar Chapter Team',
    'Assam Chapter Team',
    'Gujarat Chapter Team',
    'Japan Chapter Team',
    ...extraChapters.map((c) => c.title),
  ];

  const hasUnknownValue = value && !allKnownValues.includes(value);

  return (
    <Stack space={3}>
      <Select
        value={value || ''}
        onChange={handleChange}
        readOnly={readOnly}
      >
        <option value="">-- Select Chapter / Team --</option>

        {/* Dynamic CMS Chapters created by user */}
        {extraChapters.length > 0 && (
          <optgroup label="🏛️ Custom Chapters (Created in CMS)">
            {extraChapters.map((ch) => (
              <option key={ch._id} value={ch.title}>
                📍 {ch.title} ({ch.region === 'japan-sub' ? 'Japan Sub-Chapter' : 'India State Chapter'})
              </option>
            ))}
          </optgroup>
        )}

        {/* Static State Chapters */}
        <optgroup label="📍 State Chapters (India)">
          <option value="UP Chapter Team">📍 India Chapter — UP State Chapter</option>
          <option value="Bihar Chapter Team">📍 India Chapter — Bihar State Chapter</option>
          <option value="Assam Chapter Team">📍 India Chapter — Assam State Chapter</option>
          <option value="Gujarat Chapter Team">📍 India Chapter — Gujarat State Chapter</option>
        </optgroup>

        {/* Japan Chapter */}
        <optgroup label="🇯🇵 Japan Chapter">
          <option value="Japan Chapter Team">🇯🇵 Japan Chapter Team</option>
        </optgroup>

        {/* Central Boards & Advisory */}
        <optgroup label="🇮🇳 National Leadership & Advisory">
          <option value="Board">🇮🇳 India Chapter — Apex Governing Board</option>
          <option value="Advisory">🏛️ Advisory Board</option>
          <option value="General Member">👥 Staff & General Members</option>
        </optgroup>

        {/* Preserve any custom or legacy string value */}
        {hasUnknownValue && (
          <optgroup label="Current Value">
            <option value={value}>{value}</option>
          </optgroup>
        )}
      </Select>

      {loading ? (
        <Flex align="center" gap={2}>
          <Spinner size={1} />
          <Text size={1} muted>
            Syncing available chapters from CMS...
          </Text>
        </Flex>
      ) : value ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 12px',
            background: 'linear-gradient(135deg, rgba(24, 27, 36, 0.9) 0%, rgba(17, 20, 28, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.85)',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#94a3b8',
                fontWeight: 600,
              }}
            >
              Assigned Chapter:
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#f8fafc' }}>
              {value}
            </span>
          </div>

          <div
            style={{
              fontSize: '10.5px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(217, 119, 6, 0.12)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              color: '#fbbf24',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            ✦ Live Synced
          </div>
        </div>
      ) : (
        <Text size={1} muted>
          Select a chapter from the dropdown to assign this member.
        </Text>
      )}
    </Stack>
  );
}
