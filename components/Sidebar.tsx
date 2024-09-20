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
        <aside className={`fixed top-0 left-0 w-64 h-full bg-white shadow-md transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Waste Management</h1>
            </div>
        </aside>
    )
        
}