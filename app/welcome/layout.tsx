import SideNav from '@/app/ui/layout/sidenav/sidenav';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
 
export default async function Layout({ children }: { children: React.ReactNode }) {
  const topNav = [
    { name: 'Locales', href: '/welcome/premises', iconName: 'BuildingStorefrontIcon' },
    { name: 'Promociones', href: '/welcome/promotions', iconName: 'TicketIcon' },
  ]

  const session = await auth();
  let userName: string = '';
  
  if(session && session.user_data){
    //TODO we were using full name here, I dont have that anymore
    userName = session.user_data.username;
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row md:overflow-hidden">
      <SessionProvider>
        <div className="w-full flex-none lg:w-64">
          <SideNav topNavigation={topNav} userName={userName}/>
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto xs:p-12">{children}</div>
      </SessionProvider>
    </div>
  );
}