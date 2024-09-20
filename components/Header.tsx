'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Coins, Leaf, Search, Bell, ChevronDown, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createUser } from "@/utils/db/actions";

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
    config: chainConfig
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
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [balance, setBalance] = useState<number | null>(null);

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


    

