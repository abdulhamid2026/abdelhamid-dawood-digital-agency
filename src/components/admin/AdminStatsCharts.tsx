import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from 'recharts';

interface StatsChartsProps {
  bookings: any[];
  orders: any[];
  services: any[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent, 200 80% 55%))',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

const AdminStatsCharts: React.FC<StatsChartsProps> = ({ bookings, orders, services }) => {
  // Bookings by status
  const bookingsByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach(b => {
      const label = b.status === 'pending' ? 'معلق' : b.status === 'confirmed' ? 'مؤكد' : b.status === 'completed' ? 'مكتمل' : b.status === 'cancelled' ? 'ملغي' : b.status;
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  // Orders by status
  const ordersByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      const label = o.status === 'pending' ? 'معلق' : o.status === 'confirmed' ? 'مؤكد' : o.status === 'completed' ? 'مكتمل' : o.status === 'cancelled' ? 'ملغي' : o.status;
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const months: { name: string; bookings: number; orders: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const label = d.toLocaleDateString('ar-EG', { month: 'short', year: '2-digit' });
      const bCount = bookings.filter(b => {
        const bd = new Date(b.created_at);
        return bd.getMonth() === month && bd.getFullYear() === year;
      }).length;
      const oCount = orders.filter(o => {
        const od = new Date(o.created_at);
        return od.getMonth() === month && od.getFullYear() === year;
      }).length;
      months.push({ name: label, bookings: bCount, orders: oCount });
    }
    return months;
  }, [bookings, orders]);

  // Services distribution
  const servicesData = useMemo(() => {
    return services.slice(0, 8).map(s => ({
      name: s.name.length > 12 ? s.name.substring(0, 12) + '…' : s.name,
      bookings: bookings.filter(b => b.service_id === s.id).length,
      orders: orders.filter(o => o.service_id === s.id).length,
    })).filter(s => s.bookings > 0 || s.orders > 0);
  }, [services, bookings, orders]);

  // Revenue
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
  }, [orders]);

  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{completedBookings}</p>
            <p className="text-xs text-muted-foreground">حجوزات مكتملة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{completedOrders}</p>
            <p className="text-xs text-muted-foreground">طلبات مكتملة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{services.length}</p>
            <p className="text-xs text-muted-foreground">خدمات متاحة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">إجمالي الإيرادات</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">الاتجاه الشهري</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="bookings" name="الحجوزات" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                <Area type="monotone" dataKey="orders" name="الطلبات" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">حالة الحجوزات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              {bookingsByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={bookingsByStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} style={{ fontSize: 11 }}>
                      {bookingsByStatus.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">لا توجد بيانات</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">حالة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              {ordersByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} style={{ fontSize: 11 }}>
                      {ordersByStatus.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">لا توجد بيانات</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Performance */}
      {servicesData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">أداء الخدمات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={servicesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="bookings" name="حجوزات" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="orders" name="طلبات" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminStatsCharts;
