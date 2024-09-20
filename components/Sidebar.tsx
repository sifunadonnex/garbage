import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Trash, Coins, Medal, Settings, Home } from "lucide-react";


const sidebarItems = [
    {
        label: "Home",
        href: "/",
        icon: Home,
    },
    {
        label: "Report Waste",
        href: "/report-waste",
        icon: MapPin,
    },
    {
        label: "Collect Waste",
        href: "/collect-waste",
        icon: Trash,
    },
    {
        label: "Rewards",
        href: "/rewards",
        icon: Coins,
    },
    {
        label: "Leaderboard",
        href: "/leaderboard",
        icon: Medal,
    },
    
]

interface SidebarProps {
    open: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
    const pathname = usePathname();

    return (
        <aside className={`fixed top-0 border-r border-gray-200 left-0 w-64 h-full inset-y-0 pt-20 z-30 transform transition-transform duration-300 text-slate-700 bg-white shadow-md lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
            <nav className="flex flex-col justify-between h-full">
                <div className="px-4 py-6 space-x-8">
                {sidebarItems.map((item, index) => (
                    <Link key={index} href={item.href} passHref>
                        <Button variant={pathname === item.href ? "secondary" : "ghost"} className={`w-full justify-start py-3 ${pathname === item.href ? 'bg-green-100 text-green-800' : 'text-slate-700 hover:bg-gray-100'}`}>
                            <item.icon className="mr-3 h-5 w-5" />
                            <span className="text-base font-medium">{item.label}</span>
                        </Button>
                        </Link>
                    ))}
                </div>
                <div className="px-4 py-6 b">
                    <Button variant={ pathname === "/settings" ? "secondary" : "outline" } className={`w-full justify-start py-3 ${pathname === "/settings" ? 'bg-green-100 text-green-800' : 'text-slate-700 hover:bg-gray-100'}`}>
                        <Link href="/settings">
                            <Settings className="mr-3 h-5 w-5" />
                            <span className="text-base font-medium">Settings</span>
                        </Link>
                    </Button>
                </div>
            </nav>
        </aside>
    )
        
}