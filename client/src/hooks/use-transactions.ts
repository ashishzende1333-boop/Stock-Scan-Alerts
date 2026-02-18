import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertTransaction } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useTransactions() {
  return useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return api.transactions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const validated = api.transactions.create.input.parse(data);
      
      const res = await fetch(api.transactions.create.path, {
        method: api.transactions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create transaction");
      }
      return api.transactions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate both transactions and products since stock levels changed
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      
      toast({ title: "Transaction Recorded", description: "Stock levels updated." });
    },
    onError: (error) => {
      toast({ title: "Transaction Failed", description: error.message, variant: "destructive" });
    },
  });
}
