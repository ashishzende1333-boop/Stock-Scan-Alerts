import { useProducts } from "@/hooks/use-products";
import { useTransactions } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Package, TrendingDown, TrendingUp, Activity, ArrowRight, ClipboardList } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();

  if (productsLoading || transactionsLoading) {
    return <DashboardSkeleton />;
  }

  // Calculate Stats
  const lowStockItems = products?.filter((p) => p.quantity <= p.minQuantity) || [];
  const totalItems = products?.length || 0;
  const totalStock = products?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;
  
  // Recent transactions (last 5)
  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory status.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/scanner">
            <Button size="lg" className="shadow-lg shadow-accent/20 bg-accent hover:bg-accent/90 text-white font-bold">
              <Activity className="mr-2 h-5 w-5" />
              Quick Scan
            </Button>
          </Link>
          <Link href="/inventory">
            <Button variant="outline" size="lg">View All Items</Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Items" 
          value={totalItems} 
          icon={Package} 
          description="Unique SKUs" 
        />
        <StatsCard 
          title="Total Stock" 
          value={totalStock} 
          icon={ClipboardList} 
          description="Units on hand" 
        />
        <StatsCard 
          title="Low Stock" 
          value={lowStockItems.length} 
          icon={AlertTriangle} 
          description="Action required"
          alert={lowStockItems.length > 0} 
        />
        <StatsCard 
          title="Transactions" 
          value={transactions?.length || 0} 
          icon={Activity} 
          description="Total movements" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Low Stock Alerts</h2>
            <Link href="/inventory" className="text-sm font-medium text-accent hover:underline">
              Manage Inventory
            </Link>
          </div>
          
          {lowStockItems.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold">Stock Levels Healthy</h3>
                <p className="text-muted-foreground">No items are below their minimum threshold.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {lowStockItems.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-l-4 border-l-destructive shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex gap-4">
                        {/* placeholder Unsplash tech image */}
                        <div className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                           {product.imageUrl ? (
                             <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-mono text-xs">NO IMG</div>
                           )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                              LOW STOCK
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {product.quantity} / {product.minQuantity} Min
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/inventory?search=${product.sku}`}>
                        <Button size="sm" variant="secondary">Restock</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Latest Movements</CardTitle>
              <CardDescription>Last 5 transactions</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {recentTransactions.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No recent activity</div>
              ) : (
                <div className="divide-y">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${tx.type === 'IN' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}
                          ${tx.type === 'OUT' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : ''}
                          ${tx.type === 'ADJUSTMENT' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : ''}
                        `}>
                          {tx.type === 'IN' && <TrendingUp className="w-4 h-4" />}
                          {tx.type === 'OUT' && <TrendingDown className="w-4 h-4" />}
                          {tx.type === 'ADJUSTMENT' && <Activity className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {tx.product?.name || `Product #${tx.productId}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-sm">
                        {tx.type === 'OUT' ? '-' : '+'}{tx.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, description, alert }: any) {
  return (
    <Card className={`border shadow-sm transition-all ${alert ? 'border-destructive/50 bg-destructive/5' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <Icon className={`h-4 w-4 ${alert ? 'text-destructive' : 'text-muted-foreground'}`} />
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <div className={`text-2xl font-black font-mono ${alert ? 'text-destructive' : ''}`}>
            {value}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-12 w-48 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           <Skeleton className="h-8 w-32" />
           <Skeleton className="h-24 w-full" />
           <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-4">
           <Skeleton className="h-8 w-32" />
           <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
