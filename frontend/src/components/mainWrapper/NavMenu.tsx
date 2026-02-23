import React, { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';

import { routes } from '@/routes';
import { Button } from '@/components/library';
import { useProfile } from '@/query/queryHooks';
import { useLogout } from '@/query/mutationHooks';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

export const NavMenu: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const { profile } = useProfile();

  const { logout } = useLogout();

  const links = useMemo(() => {
    const menuRoutes = [
      profile ? routes.profile : routes.main,
      routes.collections,
    ];
    return menuRoutes.map((data) => (
      <Button
        variant="inline"
        className="w-full md:w-fit md:my-1 md:mx-2 center font-medium md:font-bold text-sm md:text-lg data-focus:bg-neutral-300/50 data-focus:shadow-inner"
        key={data.url}
        onClick={() => setLocation(data.url)}
      >
        {data.label ? t(data.label) : 'NOT TRANSLATED'}
      </Button>
    ));
  }, [profile, setLocation, t]);

  const [mobileMenuShown, setMobileMenuShown] = useState(false);

  return (
    <>
      <div className="hidden md:flex justify-around">{links}</div>
      <Menu>
        <MenuButton
          as={Button}
          variant="bordered"
          className="my-1 md:hidden rounded-md w-full font-medium"
          onClick={() => setMobileMenuShown(!mobileMenuShown)}
        >
          {t('menu.menu')}
        </MenuButton>
        <MenuItems
          anchor={{ to: 'bottom', gap: 4 }}
          className="bg-o-white ring-1 ring-o-black py-1 px-2 rounded-md grid grid-cols-1 gap-1"
        >
          {links.map((link) => (
            <MenuItem key={link.key}>{link}</MenuItem>
          ))}
          {profile && (
            <MenuItem
              as={Button}
              variant="inline"
              className="w-full p-0 center font-medium md:font-bold text-sm md:text-lg data-focus:bg-neutral-300/50 data-focus:shadow-inner"
              onClick={() => logout()}
            >
              {t('common.logout')}
            </MenuItem>
          )}
        </MenuItems>
      </Menu>
    </>
  );
};
