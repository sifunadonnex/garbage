//@ts-nocheck
'use client'

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Coins, Droplets, Search, Bell, ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createUser, getUnreadNotifications, getUserBalance, getUserByEmail, markNotificationAsRead } from "@/utils/db/actions";

const clientId = process.env.WEB3_AUTH_CLIENT_ID;

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Sepolia",
    tickerName: "Ethereum",
    blockExplorer: "https://sepolia.etherscan.io",
    ticker: "ETH",
    logo: "https://assets.web3auth.io/evm/evm-logo.png",
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
        chainConfig,
    }
});

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
    privateKeyProvider,
});

interface HeaderProps {
    onMenuClick: () => void;
    totalEarnings: number;
}

export default function Header({ onMenuClick, totalEarnings }: HeaderProps) {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<any>(null);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [balance, setBalance] = useState<number | null>(0);
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);

                if(web3auth.connected) {
                    setIsLoggedIn(true);
                    const userInfo = await web3auth.getUserInfo();
                    setUserInfo(userInfo);
                    
                    if(userInfo.email) {
                        localStorage.setItem('userEmail', userInfo.email);
                        try {
                            await createUser(userInfo.email, userInfo?.name || 'Anonymous User');
                        } catch (error) {
                            console.error('Error creating user', error);
                        }
                    }
                }
            } catch (error) {
                console.error("Error initializing Web3Auth:", error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            if(userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email);
                if(user) {
                    const unreadNotifications = await getUnreadNotifications(user.id);
                    setNotifications(unreadNotifications);
                }
            }
        };

        fetchNotifications();
        const notificationInterval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(notificationInterval);
    }, [userInfo]);
    
    useEffect(() => {
        const fetchUserBalance = async () => {
            if(userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email);
                if(user) {
                    const balance = await getUserBalance(user.id);
                    setBalance(balance);
                }
            }
        };

        fetchUserBalance();
        const handleBalanceUpdate = (event: CustomEvent) => {
            const newBalance = event.detail;
            setBalance(newBalance);
        };

        window.addEventListener('balanceUpdate', handleBalanceUpdate as EventListener);
        return () => {
            window.removeEventListener('balanceUpdate', handleBalanceUpdate as EventListener);
        };
    }, [userInfo]);
    
    const login = async () => {
        if(!Web3Auth){
            console.log("Web3Auth not initialized");
            return;
        }
        try {
            const web3authProvider = await web3auth.connect();
            setProvider(web3authProvider);
            setIsLoggedIn(true);
            const userInfo = await web3auth.getUserInfo();
            setUserInfo(userInfo);
            if(userInfo.email) {
                localStorage.setItem('userEmail', userInfo.email);
                try {
                    await createUser(userInfo.email, userInfo?.name || 'Anonymous User');
                } catch (error) {
                    console.error('Error creating user', error);
                }
            }
        } catch (error) {
            console.error("Error logging in", error);
        }
    };

    const logout = async () => {
        if(!Web3Auth){
            console.log("Web3Auth not initialized");
            return;
        }
        try {
            await web3auth.logout();
            setProvider(null);
            setIsLoggedIn(false);
            setUserInfo(null);
            localStorage.removeItem('userEmail');
        } catch (error) {
            console.error("Error logging out", error);
        }
    }

    const getUserInfo = async () => {
        if(web3auth.connected) {
            const userInfo = await web3auth.getUserInfo();
            setUserInfo(userInfo);
            if(userInfo.email) {
                localStorage.setItem('userEmail', userInfo.email);
                try {
                    await createUser(userInfo.email, userInfo?.name || 'Anonymous User');
                } catch (error) {
                    console.error('Error creating user', error);
                }
            }
        }
    };

    const handleNotificationClick = async (notificationId: number) => {
        if(userInfo && userInfo.email) {
            const user = await getUserByEmail(userInfo.email);
            if(user) {
                await markNotificationAsRead(notificationId);
                const updatedNotifications = await getUnreadNotifications(user.id);
                setNotifications(updatedNotifications);
            }
        }
    };

    if(isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center">
                    <Button onClick={onMenuClick} variant="ghost" className="mr-2 md:mr-4">
                        <Menu className="h-6 w-6 text-slate-700" />
                    </Button>
                    <Link href="/" className="flex items-center">
                        <Droplets className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-2 md:mr-4" />
                        <span className="font-bold text-base md:text-lg text-slate-700">EcoChain</span>
                    </Link>
                </div>
                {!isMobile && (
                    <div className="flex-1 max-w-xl mx-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                    </div>
                )}
                <div className="flex items-center">
                    {isMobile && (
                        <Button variant="ghost" className="mr-2 md:mr-4">
                            <Search className="h-6 w-6 text-slate-700" />
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="mr-2 md:mr-4">
                                <Bell className="h-6 w-6 text-slate-700" />
                                {notifications && notifications.length > 0 && (
                                    <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.2rem] h-5">{notifications.length}</Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            { notifications && notifications.length > 0 ? (
                                notifications.map((notification: any) => (
                                    <DropdownMenuItem key={notification.id} onClick={() => handleNotificationClick(notification.id)}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{notification.type}</span>
                                            <span className="text-sm text-gray-500">{notification.message}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem>
                                    <span>No new notifications</span>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                        <div className="mr-2 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
                            <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
                            <span className="text-sm font-semibold md:text-base text-gray-800">{balance?.toFixed(2)}</span>
                        </div>
                        {!isLoggedIn ? (
                            <Button onClick={login} className="ml-2 md:ml-4 bg-green-600 hover:bg-green-700 text-white">
                                Login
                                <LogIn className="h-4 w-4 ml-1 md:ml-2 md:h-6 md:w-6" />
                            </Button>
                        ):(
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex item-center mr-2 md:mr-4">
                                        <User className="h-6 w-6 text-slate-700 mr-1" />
                                        <ChevronDown className="h-4 w-4 ml-1 text-slate-700" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64">
                                    <DropdownMenuItem onClick={getUserInfo}>
                                        {userInfo?.name ? (
                                            <span>{userInfo.name}</span>
                                        ) : (
                                            <span>Profile</span>
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout}>
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}


    

