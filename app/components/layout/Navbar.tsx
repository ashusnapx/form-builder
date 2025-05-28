import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "@remix-run/react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../ui/navigation-menu";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";



interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode; // reserved for future
}

const navItems: NavItem[] = [
  { label: "Builder", path: "/" },
  { label: "Templates", path: "/templates" },
  { label: "Responses", path: "/responses" },
];

export const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // Accessibility: close mobile menu on Escape
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    },
    [closeMobileMenu]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const navLinkClasses = useCallback(
    (path: string) =>
      clsx(
        "relative text-sm font-medium transition duration-300",
        "hover:text-blue-600 dark:hover:text-blue-400",
        "before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-blue-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-300",
        isActive(path)
          ? "text-blue-600 dark:text-blue-400 before:scale-x-100"
          : "text-gray-600 dark:text-gray-300 hover:before:scale-x-100"
      ),
    [isActive]
  );

  const themeToggleLabel = useMemo(
    () => (theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"),
    [theme]
  );

  // Toggle mobile menu open state
  const toggleMobileMenu = () => setMobileMenuOpen((open) => !open);

  return (
    <header className='sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between h-16'>
        {/* Logo */}
        <Link
          to='/'
          className='flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400'
          aria-label='FormBuilder Home'
        >
          <svg
            className='w-6 h-6 text-blue-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          FormBuilder
        </Link>

        {/* Desktop Navigation */}
        <nav
          className='hidden md:flex items-center gap-8'
          aria-label='Main Navigation'
        >
          <NavigationMenu>
            <NavigationMenuList className='flex gap-6'>
              {navItems.map(({ label, path }) => (
                <NavigationMenuItem key={label}>
                  <NavigationMenuLink
                    asChild
                    className={navLinkClasses(path)}
                    aria-current={isActive(path) ? "page" : undefined}
                  >
                    <Link to={path}>{label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Theme toggle using Switch */}
          {isMounted && (
            <Button
              variant='ghost'
              onClick={toggleTheme}
              title={themeToggleLabel}
              aria-label={themeToggleLabel}
              className='ml-2 p-2 rounded-full text-gray-700 dark:text-gray-300'
            >
              {theme === "dark" ? (
                <Sun className='w-5 h-5' />
              ) : (
                <Moon className='w-5 h-5' />
              )}
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className='md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300'
            >
              <AnimatePresence mode='wait' initial={false}>
                <motion.div
                  key={mobileMenuOpen ? "close" : "open"}
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <X className='w-6 h-6' />
                  ) : (
                    <Menu className='w-6 h-6' />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align='start'
            side='bottom'
            className='w-screen max-w-xs p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg md:hidden'
            onPointerDownOutside={() => setMobileMenuOpen(false)}
          >
            <nav
              className='flex flex-col space-y-2'
              aria-label='Mobile Navigation'
              role='menu'
            >
              {navItems.map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "block px-3 py-2 rounded-md text-base font-medium transition",
                    isActive(path)
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  role='menuitem'
                  tabIndex={0}
                  aria-current={isActive(path) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}

              {/* Theme toggle button */}
              <Button
                variant='ghost'
                className='flex items-center gap-2 px-3 py-2 rounded-md text-base text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition'
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                aria-label={themeToggleLabel}
                role='menuitem'
              >
                {theme === "dark" ? (
                  <Sun className='w-5 h-5' />
                ) : (
                  <Moon className='w-5 h-5' />
                )}
                {themeToggleLabel}
              </Button>
            </nav>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
