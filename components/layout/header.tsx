'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Plane, Menu, LayoutDashboard, CalendarCheck, Repeat, Bell, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/roster', label: 'Roster', icon: CalendarCheck },
    { href: '/swap-requests', label: 'Swap Requests', icon: Repeat },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* The main container uses flex and items-center */}
      <div className="container max-w-screen-xl mx-auto h-16 flex items-center">

        {/* --- Left Section --- */}
        {/* This div pushes everything else to the right. 'flex-1' makes it grow. */}
        <div className="flex-1 flex justify-start">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Plane className="w-6 h-6 text-blue-600" />
            <span className="hidden sm:inline-block">CrewSwap</span>
          </Link>
        </div>

        {/* --- Center Section --- */}
        {/* This nav will not grow ('flex-none') and will be centered between the left and right sections. */}
        <nav className="hidden md:flex flex-none justify-center items-center gap-2">
          {navLinks.map(link => (
            <Button key={link.href} variant="ghost" asChild>
              <Link 
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
        
        {/* --- Right Section --- */}
        {/* This div also grows ('flex-1') and pushes its content to the very end. */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/roster')}>
                   <CalendarCheck className="mr-2 h-4 w-4" />
                  <span>Roster</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="mb-8">
                  <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                    <Plane className="w-6 h-6 text-blue-600" />
                    <span>CrewSwap</span>
                  </Link>
                </div>
                <nav className="grid gap-4 text-lg font-medium">
                  {navLinks.map(link => (
                    <Link 
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-4 rounded-lg py-2 px-3 text-muted-foreground hover:text-foreground hover:bg-gray-100"
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}