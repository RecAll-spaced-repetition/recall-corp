import React, { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/state';
import { Button } from '@/components/library';
import { useProfile } from '@/query/queryHooks';
import { MiniCard } from '@/components/card';

import intervalsImage from '@public/img/intervalsWide.png';
import { StaticFlippingCard } from '@/components/card';
import { MarkdownRenderComponent } from '@/components/editor';
import { Redirect } from 'wouter';
import { routes } from '@/routes';

type ExampleCardSides = {
  frontSide: string;
  backSide: string;
  unstyled?: boolean;
};

const ExampleCard: React.FC<ExampleCardSides> = ({
  frontSide,
  backSide,
  unstyled,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <StaticFlippingCard
      className="min-h-64 md:min-h-48"
      flipped={isFlipped}
      frontSide={
        <MiniCard
          onClick={() => setIsFlipped((val) => !val)}
          className="bg-lime-200 hover:bg-lime-300 ring-4"
          shadowOff
        >
          <span className="text-2xl text-center lg:text-4xl font-semibold">
            {frontSide}
          </span>
        </MiniCard>
      }
      backSide={
        <MiniCard className="bg-lime-200 hover:bg-lime-300 ring-4">
          <MarkdownRenderComponent
            extended
            unstyled={unstyled}
            rawText={backSide}
          />
        </MiniCard>
      }
    />
  );
};

type ExampleKey = 'markup' | 'latex' | 'photo' | 'video' | 'audio';
const EXAMPLES: Record<ExampleKey, ExampleCardSides> = {
  markup: {
    frontSide: 'Крутая разметка',
    backSide:
      '# Заголовки\n## Разных уровней\nСписки:\n- **Жирный**\n- *курсив*\n- [Ссылки](/)',
  },
  latex: {
    frontSide: 'LaTeX - красивые формулы',
    backSide:
      '$$\nE = mc^2\n$$\n$$\n\\begin{cases}ax^2 + bx + c = 0 \\\\ D = b^2 - 4ac\\\\ x_{1,2} = \\frac{-b\\plusmn\\sqrt{D}}{2a}\\end{cases}\n$$\n$$\nRMSE = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(y_{i} - x_{i})^{2}}\n$$',
  },
  photo: {
    frontSide: 'Фото',
    backSide:
      '![Фото кота](https://img.freepik.com/free-photo/closeup-shot-one-ginger-cat-hugging-licking-other-isolated-white-wall_181624-32893.jpg?semt=ais_hybrid&w=740)',
  },
  video: {
    frontSide: 'Видео',
    backSide:
      '![Видео водопада](https://tekeye.uk/html/images/Joren_Falls_Izu_Jap.mp4)',
  },
  audio: {
    frontSide: 'Аудио',
    backSide: '![Тестовое аудио](https://sanstv.ru/test/audio/test.mp3)',
  },
};

export const StartPage: React.FC = () => {
  const { profile } = useProfile();
  const showRegisterWindow = useAppStore((state) => state.showRegisterWindow);
  const { t } = useTranslation();

  if (profile) return <Redirect to={routes.profile.getUrl()} />;

  return (
    <div className="vstack text-o-black rounded-md">
      <div className="full center vstack">
        <div className="h-screen pt-28 md:pt-30 lg:pt-36 xl:pt-48">
          <MiniCard
            className="bg-lime-200 hover:bg-lime-300 ring-4"
            onClick={() =>
              document
                .getElementById('description')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            <h1 className="text-4xl lg:text-6xl text-center my-6 font-bold">
              {t('startPage.title')}
            </h1>
          </MiniCard>
        </div>

        <div
          className={clsx(
            'h-screen pt-16 gap-6',
            'grid grid-cols-1 md:grid-cols-2'
          )}
        >
          <div className="flex items-end md:vstack md:center">
            <img
              className="rounded-lg shadow-lg"
              src={intervalsImage}
              alt=""
              id="description"
            />
          </div>
          <div className="vstack items-center justify-center">
            <p className="text-md lg:text-2xl text-center my-4 font-medium">
              {t('startPage.p1')}
            </p>
            <div className="around gap-x-2">
              <Button
                variant="plate-green"
                className={clsx(
                  'font-medium text-xl lg:text-2xl',
                  'px-4 py-1 md:py-2 md:px-6',
                  'rounded-3xl'
                )}
                onClick={showRegisterWindow}
                title={t('startPage.join')}
                withShadow
                shadowBoxClassName="my-2 md:my-4 w-fit"
              >
                {t('startPage.join')}
              </Button>
              <Button
                variant="plate-yellow"
                className={clsx(
                  'font-medium text-xl lg:text-2xl',
                  'px-2 py-1 md:py-2 md:px-3',
                  'rounded-3xl'
                )}
                onClick={() =>
                  document
                    .getElementById('features')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                withShadow
                title={t('startPage.why')}
                shadowBoxClassName="my-2 md:my-4 w-fit"
              >
                {t('startPage.why')}
              </Button>
            </div>
          </div>
        </div>
        <div className="pt-40 min-h-screen h-fit w-full">
          <h2
            className="text-2xl lg:text-4xl text-center font-bold mb-2"
            id="features"
          >
            Наши фишки
          </h2>
          <h3 className="text-xl lg:text-2xl text-center font-medium mb-10">
            Кликни для просмотра
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-6">
            <ExampleCard unstyled {...EXAMPLES.photo} />
            <ExampleCard unstyled {...EXAMPLES.video} />
            <ExampleCard {...EXAMPLES.audio} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-10">
            <ExampleCard {...EXAMPLES.markup} />
            <ExampleCard {...EXAMPLES.latex} />
          </div>
          <h2 className="text-md lg:text-lg text-center font-medium mb-2">
            А ещё мы позволяем загружать медиафайлы небольшого размера прямо на
            наше сервер!
          </h2>
          <h2 className="text-lg lg:text-xl text-center font-medium mb-2">
            И многое другое! Попробуй сам ;)
          </h2>
          <div className="center">
            <Button
              variant="plate-green"
              className={clsx(
                'font-medium text-xl lg:text-2xl',
                'px-4 py-1 md:py-2 md:px-6',
                'rounded-3xl'
              )}
              onClick={showRegisterWindow}
              title={t('startPage.join')}
              withShadow
              shadowBoxClassName="my-2 md:my-4 w-fit"
            >
              {t('startPage.join')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
