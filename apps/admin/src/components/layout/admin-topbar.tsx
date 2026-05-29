'use client';

import * as React from 'react';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@mcduffcare/ui/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@mcduffcare/ui/components/ui/dropdown-menu';
import { getInitials } from '@mcduffcare/ui/lib/utils';
import { useCurrentUser } from '@mcduffcare/api-client/hooks/use-auth';

export function AdminTopbar(): React.JSX.Element {
  const { data: user } = useCurrentUser({ retry: false });
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex-1 max-w-md">
        <Input
          type="search"
          placeholder="Search orders, products, customers..."
          leftElement={<Search className="h-4 w-4" />}
          className="h-9 border-muted bg-muted/40 focus-visible:bg-background"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-red" aria-label="New notifications" />
        </Button>

        {user !== undefined && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name} />
                  <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold font-heading leading-none">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
