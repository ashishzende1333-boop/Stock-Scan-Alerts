import { useProducts } from "@/hooks/use-products";
import { useTransactions } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function Reports() {
  const { data: products } = useProducts();
  const { data: transactions } = useTransactions();

  // Data processing for charts
  
  // 1. Stock Status Distribution
  const lowStockCount = products?.filter(p => p.quantity <= p.minQuantity).length || 0;
  const goodStockCount = (products?.length || 0) - lowStockCount;
  
  const stockStatusData = [
    { name: 'Healthy', value: goodStockCount, color: '#22c55e' },
    { name: 'Low Stock', value: lowStockCount, color: '#ef4444' },
  ];

  // 2. Transaction Types Distribution
  const txTypes = transactions?.reduce((acc, tx) => {
    acc[tx.type] = (acc[tx.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const txData = [
    { name: 'Inbound', value: txTypes?.['IN'] || 0, color: '#22c55e' },
    { name: 'Outbound', value: txTypes?.['OUT'] || 0, color: '#ef4444' },
    { name: 'Adjustments', value: txTypes?.['ADJUSTMENT'] || 0, color: '#f97316' },
  ];

  // 3. Top 5 Products by Quantity
  const topStock = products
    ?.sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      quantity: p.quantity
    })) || [];

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Insights into inventory performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Health Pie Chart */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
            <CardDescription>Ratio of items below minimum threshold</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transaction Types Pie Chart */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Movement Types</CardTitle>
            <CardDescription>Distribution of inventory actions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={txData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {txData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Stock Bar Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Highest Stock Items</CardTitle>
            <CardDescription>Top 5 products by current quantity</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topStock} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
