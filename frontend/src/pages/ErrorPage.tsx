import { routes } from '@/routes';
import React from 'react';
import { Link } from 'wouter';
import { Button, LoadableComponent } from '@/components/library';

export interface ErrorPageProps {
  message: string;
  isPending?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ message, isPending }) => {
  return (
    <div className="vstack rounded-md">
      <LoadableComponent isPending={isPending} animated>
        <h1 className="text-4xl text-center m-2 font-bold text-red-600">
          Error!
        </h1>
        <h2 className="text-2xl text-center m-2 font-medium text-red-600">
          {message}
        </h2>
        <div className="w-full center text-lg">
          {/* TODO: Сделать тут наконец нормальный обратный переход */}
          <Link to={routes.main.getUrl()}> 
            <Button className="m-2" variant="bordered">
              Go back
            </Button>
          </Link>
          <Link to={routes.main.getUrl()}>
            <Button className="m-2" variant="plate-blue">
              Go to main page
            </Button>
          </Link>
        </div>
      </LoadableComponent>
    </div>
  );
};
