'use client';

import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {supabase} from '@/lib/supabase';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const [
                {count: productsCount},
                {count: ordersCount},
                {count: customersCount},
                {data: revenue},
            ] = await Promise.all([
                supabase.from('products').select('*', {count: 'exact', head: true}),
                supabase.from('orders').select('*', {count: 'exact', head: true}),
                supabase.from('users').select('*', {count: 'exact', head: true}),
                supabase.from('orders').select('total'),
            ]);

            const totalRevenue = revenue?.reduce((acc, order) => acc + order.total, 0) || 0;

            setStats({
                totalProducts: productsCount || 0,
                totalOrders: ordersCount || 0,
                totalCustomers: customersCount || 0,
                totalRevenue,
            });
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProducts}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${stats.totalRevenue.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}