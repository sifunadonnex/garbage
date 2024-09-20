import { db } from "./dbConfig";
import { Users, Notifications, Transactions } from "./schema";
import { eq, sql, and, desc } from "drizzle-orm";

export async function createUser(email: string, name: string) {
    try {
        const [user] = await db.insert(Users).values({
            email,
            name,
        }).returning().execute();
        return user;
    } catch (error) {
        console.error('Error creating user', error);
        return null;
    }
}

export async function getUserByEmail(email: string) {
    try {
        const [user] = await db.select().from(Users).where(eq(Users.email, email)).execute();
        return user;
    } catch (error) {
        console.error('Error getting user by email', error);
        return null;
    }
}

export async function getUnreadNotifications(userId: number) {
    try {
        const [user] = await db.select().from(Notifications).where(and(eq(Notifications.userId, userId), eq(Notifications.isRead, false))).execute();
        return user;
    } catch (error) {
        console.error('Error getting unread notifications', error);
        return null;
    }
}

export async function getUserBalance(userId: number): Promise<number> {
    const transactions = await getRewardTransactions(userId);
    if (!transactions) return 0;
    const balance = transactions.reduce((total: number, transaction: any) => {
        return transaction.type === 'earned' ? total + transaction.amount : total - transaction.amount;
    }, 0);
    return balance;
}

async function getRewardTransactions(userId: number){
    try {
        const transactions = await db.select({
            id: Transactions.id,
            amount: Transactions.amount,
            date: Transactions.date,
            description: Transactions.description,
            type: Transactions.type,
        }).from(Transactions).where(eq(Transactions.userId, userId)).orderBy(desc(Transactions.date)).limit(10).execute();

        const formattedTransactions = transactions.map((transaction) => ({
            ...transaction,
            date: transaction.date ? transaction.date.toISOString().split('T')[0] : null
        }));
        return formattedTransactions;
    } catch (error) {
        console.error('Error getting reward transactions', error);
        return null;
    }
}

export async function markNotificationAsRead(notificationId: number) {
    try {
        await db.update(Notifications).set({ isRead: true }).where(eq(Notifications.id, notificationId)).execute();
    } catch (error) {
        console.error('Error marking notification as read', error);
    }
}
