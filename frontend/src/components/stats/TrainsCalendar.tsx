import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from '@tanstack/react-query';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

import { LoadableComponent } from '@/components/library';
import { getTrainCollectionWhenQueryOptions } from '@/query/queryHooks';
import { CollectionShort } from '@/api';

export type TrainsCalendarProps = {
  collections: CollectionShort[];
};

type CollectionShortWithDate = CollectionShort & {
  date: Date;
  isNow?: boolean;
};

const isEqualByDate = (date1: Date, date2: Date) =>
  date1.toDateString() === date2.toDateString();

export const TrainsCalendar: React.FC<TrainsCalendarProps> = ({
  collections,
}) => {
  const { t } = useTranslation();

  // TODO: Вынести в queryHooks
  const { whenCollections, isPending, error } = useQueries({
    queries: collections.map((collection) =>
      getTrainCollectionWhenQueryOptions(collection.id)
    ),
    combine: (responses) => {
      if (responses.some((when) => when.isPending))
        return { whenCollections: [], isPending: true, error: undefined };

      const errorResponse = responses.find((when) => when.error);
      if (errorResponse)
        return {
          whenCollections: [],
          isPending: false,
          error: errorResponse.error,
        };

      const whenCollections: CollectionShortWithDate[] = responses
        .map(
          (response) =>
            response.data &&
            response.data.when.type !== 'never' && {
              ...response.data,
              date:
                response.data.when.type === 'due'
                  ? new Date(response.data.when.due)
                  : new Date(),
              isNow: response.data.when.type === 'now',
            }
        )
        .filter((date) => !!date);

      return { whenCollections, isPending: false, error: undefined };
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date>();

  const selectedDayCollections = useMemo(() => {
    if (!whenCollections || !selectedDate) return [];

    return whenCollections.filter((trainDate) =>
      isEqualByDate(trainDate.date, selectedDate)
    );
  }, [whenCollections, selectedDate]);

  return (
    <LoadableComponent
      className="flex flex-col items-center gap-2"
      isPending={isPending}
      errorMessage={error?.message}
      animated
    >
      {whenCollections && whenCollections.length > 0 && (
        <DayPicker
          className="mb-2 md:mb-6"
          animate
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{
            trainDates: whenCollections.map((item) => item.date),
          }}
          modifiersClassNames={{
            trainDates: 'underline decoration-2 underline-offset-4',
          }}
        />
      )}
      {/* TODO: Стилизовать */}
      {selectedDayCollections.length > 0 && <h3>{t('profile.nextTrains')}</h3>}
      {selectedDayCollections.map((collection) => (
        <p key={collection.id}>
          {collection.title}:{' '}
          {collection.isNow
            ? t('collection.trainNow')
            : t('collection.trainDue', {
                date: collection.date.toLocaleString(),
              })}
        </p>
      ))}
    </LoadableComponent>
  );
};
