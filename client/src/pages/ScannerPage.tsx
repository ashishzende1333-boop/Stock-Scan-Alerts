import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useProductBySku, useUpdateProduct, useCreateTransaction } from "@/hooks/use-products";
import { Scanner } from "@/components/Scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanLine, Search, Package, Plus, Minus, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Badge } from "@/components/ui/badge";

export default function ScannerPage() {
  const [sku, setSku] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const { data: product, isLoading, isError } = useProductBySku(sku);
  const createTransaction = useCreateTransaction();
  const updateProduct = useUpdateProduct();
  const queryClient = useQueryClient();
  
  // URL params handling
  const searchStr = window.location.search;
  const urlParams = new URLSearchParams(searchStr);
  const initialSku = urlParams.get("sku");

  useEffect(() => {
    if (initialSku) {
      setSku(initialSku);
    }
  }, [initialSku]);

  // Transaction State
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<"IN" | "OUT">("OUT");

  const handleScan = (decodedText: string) => {
    setIsScanning(false);
    setSku(decodedText);
  };

  const handleTransaction = () => {
    if (!product) return;

    createTransaction.mutate({
      productId: product.id,
      type: mode,
      quantity: quantity,
    }, {
      onSuccess: () => {
        // Optimistic update of local product quantity display
        const newQty = mode === 'IN' ? product.quantity + quantity : product.quantity - quantity;
        updateProduct.mutate({ id: product.id, quantity: newQty });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Scanner</h1>
        <p className="text-muted-foreground">Scan barcodes to manage stock.</p>
      </div>

      {/* Scanner Control */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={sku} 
            onChange={(e) => setSku(e.target.value)} 
            placeholder="Enter SKU or Scan..." 
            className="pl-9 font-mono"
          />
        </div>
        <Button onClick={() => setIsScanning(true)} className="bg-primary hover:bg-primary/90">
          <ScanLine className="w-4 h-4 mr-2" /> Scan
        </Button>
      </div>

      <Scanner 
        isScanning={isScanning} 
        onScan={handleScan} 
        onClose={() => setIsScanning(false)} 
      />

      {/* Product Result */}
      {sku && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isLoading ? (
            <Card className="p-8 flex justify-center text-muted-foreground">Searching...</Card>
          ) : !product ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="font-bold text-lg">Product Not Found</h3>
                <p className="text-muted-foreground mb-4">SKU: {sku}</p>
                <Button>Create New Product</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden shadow-lg border-accent/20">
              <div className="h-2 bg-accent w-full" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <CardDescription className="font-mono mt-1">{product.sku}</CardDescription>
                  </div>
                  {product.quantity <= product.minQuantity && (
                    <Badge variant="destructive">LOW STOCK</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Current Stock</span>
                    <div className="text-3xl font-mono font-bold mt-1">{product.quantity}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Location</span>
                    <div className="text-lg font-medium mt-1">{product.location || "—"}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Tabs value={mode} onValueChange={(v) => setMode(v as "IN" | "OUT")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="OUT" className="data-[state=active]:bg-destructive data-[state=active]:text-white">
                        <Minus className="w-4 h-4 mr-2" /> Remove Stock
                      </TabsTrigger>
                      <TabsTrigger value="IN" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Stock
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="text-center text-xl font-bold h-12"
                        />
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className={`flex-1 font-bold ${
                        mode === 'IN' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-destructive hover:bg-destructive/90'
                      }`}
                      onClick={handleTransaction}
                      disabled={createTransaction.isPending}
                    >
                      {createTransaction.isPending ? "Updating..." : "Confirm"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
