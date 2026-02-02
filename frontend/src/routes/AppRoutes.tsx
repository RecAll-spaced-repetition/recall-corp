import React from 'react';
import { Route, Switch } from 'wouter';
import { routes } from './routesList';
import { useTranslation } from 'react-i18next';

export const AppRoutes: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Switch>
      {Object.values(routes).map((data) => (
        <Route path={data.url} key={data.url}>
          {data.content}
        </Route>
      ))}
      <Route>
        <h1>{t('common.404')}</h1>
      </Route>
    </Switch>
  );
};
