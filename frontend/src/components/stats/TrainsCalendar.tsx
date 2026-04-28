import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { ru, enUS } from 'react-day-picker/locale';
import 'react-day-picker/style.css';

import { LoadableComponent } from '@/components/library';
import { CollectionShort } from '@/api';
import clsx from 'clsx';
import { CollectionCard } from '../collection/CollectionCard';
import { useTrainCollectionsWhens } from '@/query/queryHooks/useTrainCollectionsWhens';
import { match } from 'ts-pattern';

export type TrainsCalendarProps = {
  collections: CollectionShort[];
};

const isEqualByDate = (date1: Date, date2: Date) =>
  date1.toDateString() === date2.toDateString();

export const TrainsCalendar: React.FC<TrainsCalendarProps> = ({
  collections,
}) => {
  const {
    t,
    i18n: {
      languages: [lang],
    },
  } = useTranslation();

  const locale = match(lang)
    .with('ru', () => ru)
    .otherwise(() => enUS);

  const { whenCollections, isPending, error } =
    useTrainCollectionsWhens(collections);

  const [selectedDate, setSelectedDate] = useState<Date>();

  const defaultClassNames = useMemo(() => getDefaultClassNames(), []);
  const [activeMonth, setActiveMonth] = useState<Date>(new Date());
  const hasTrainInNextMonth = useMemo(() => {
    if (!activeMonth) return false;
    return whenCollections.some(
      (collection) =>
        collection.date.getMonth() !== activeMonth.getMonth() &&
        collection.date > activeMonth
    );
  }, [whenCollections, activeMonth]);
  const hasTrainInPrevMonth = useMemo(() => {
    if (!activeMonth) return false;
    return whenCollections.some(
      (collection) =>
        collection.date.getMonth() !== activeMonth.getMonth() &&
        collection.date < activeMonth
    );
  }, [whenCollections, activeMonth]);

  const selectedDayCollections = useMemo(() => {
    if (!whenCollections || !selectedDate) return [];

    return whenCollections.filter((trainDate) =>
      isEqualByDate(trainDate.date, selectedDate)
    );
  }, [whenCollections, selectedDate]);

  const hasSelectedDayCollections = selectedDayCollections.length > 0;

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const element = contentRef.current;

    if (!element) return;

    const updateHeight = () => {
      setContentHeight(hasSelectedDayCollections ? element.scrollHeight : 0);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [hasSelectedDayCollections, selectedDayCollections]);

  return (
    <LoadableComponent
      className="w-full flex flex-col items-center gap-2"
      isPending={isPending}
      errorMessage={error?.message}
      animated
    >
      {whenCollections && whenCollections.length > 0 && (
        // TODO: Добавить стилизации (подчёркивать стрелочки, если в будущем / в прошлом есть тренировки)
        <DayPicker
          className="mb-2 md:mb-6"
          locale={locale}
          animate
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={activeMonth}
          onMonthChange={setActiveMonth}
          modifiers={{
            trainDates: whenCollections.map((item) => item.date),
          }}
          modifiersClassNames={{
            trainDates: 'underline decoration-2 underline-offset-4',
          }}
          classNames={{
            button_next: clsx(
              // defaultClassNames.button_next,
              hasTrainInNextMonth && 'bg-black'
            ),
            button_previous: clsx(
              // defaultClassNames.button_previous,
              hasTrainInPrevMonth && 'bg-black'
            ),
          }}
        />
      )}
      <div
        className="w-full overflow-hidden transition-base"
        style={{
          height: `${contentHeight}px`,
          opacity: hasSelectedDayCollections ? 1 : 0,
        }}
      >
        <div
          ref={contentRef}
          className={clsx(
            'transition-base w-full',
            hasSelectedDayCollections ? 'translate-y-0' : '-translate-y-2'
          )}
        >
          <h3 className="text-center">{t('profile.nextTrains')}</h3>
          <ul
            className={clsx(
              'w-full mt-4',
              'grid align-center justify-center gap-4'
            )}
            style={{
              gridTemplateColumns: 'repeat( auto-fit, minmax(300px, 1fr))',
            }}
          >
            {selectedDayCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collectionId={collection.id}
              />
            ))}
          </ul>
        </div>
      </div>
    </LoadableComponent>
  );
};
