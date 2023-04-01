import { type ROUTES } from '@sat/constants/routes';
import Link from 'next/link';
import React from 'react';

type Keys = keyof typeof ROUTES;
type RouteValues = (typeof ROUTES)[Keys];

type Props = {
  href: RouteValues;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const NavLink: React.FC<Props> = (props: Props) => {
  return <Link {...props} />;
};

export default NavLink;
