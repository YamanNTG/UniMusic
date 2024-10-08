type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/favorites ", label: "favorites" },
  { href: "/bookings ", label: "bookings" },
  { href: "/reviews ", label: "reviews" },
  { href: "/reservations ", label: "reservations" },
  { href: "/classes/create ", label: "create classes" },
  { href: "/classes", label: "my classes" },
  { href: "/admin ", label: "admin" },
  { href: "/profile ", label: "profile" },
];
