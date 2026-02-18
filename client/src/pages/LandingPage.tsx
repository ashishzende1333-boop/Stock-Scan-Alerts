import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, ArrowRight, Box, BarChart3, ScanLine } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-black text-2xl tracking-tighter flex items-center gap-2">
            <span className="text-accent">INV</span><span>CTRL</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <a href="/api/login">Log In</a>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <a href="/api/login">Get Started</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase">
              Industrial Grade Inventory System
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]">
              Control Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Inventory.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              The modern, mobile-first solution for manufacturing inventory. Scan barcodes, track stock in real-time, and prevent shortages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 h-14 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" asChild>
                <a href="/api/login">Start Free Trial <ArrowRight className="ml-2 w-5 h-5"/></a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                View Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> Free Forever Tier
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> No Credit Card
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-purple-500/20 blur-3xl rounded-full opacity-30" />
            <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden aspect-[4/3]">
              {/* Abstract UI Representation */}
              <div className="bg-muted/50 border-b p-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="p-8 grid grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4 shadow-sm">
                  <div className="w-8 h-8 rounded bg-accent/20 mb-2" />
                  <div className="h-4 w-24 bg-muted rounded mb-1" />
                  <div className="h-8 w-16 bg-muted rounded" />
                </div>
                <div className="bg-background rounded-lg p-4 shadow-sm">
                  <div className="w-8 h-8 rounded bg-primary/20 mb-2" />
                  <div className="h-4 w-24 bg-muted rounded mb-1" />
                  <div className="h-8 w-16 bg-muted rounded" />
                </div>
                <div className="col-span-2 bg-background rounded-lg p-4 shadow-sm h-32 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <ScanLine className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <span className="text-sm font-mono">SCANNING ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">Built for Operations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to keep production running smoothly without the spreadsheet chaos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={ScanLine}
              title="Barcode Scanning"
              description="Use your device's camera to instantly look up items, check stock, and process transactions."
            />
            <FeatureCard 
              icon={Box}
              title="Real-time Inventory"
              description="Track stock levels across multiple locations with instant updates as items move."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Smart Alerts"
              description="Get notified automatically when stock drops below your defined minimum thresholds."
            />
          </div>
        </div>
      </section>
      
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        &copy; 2024 INVCTRL Systems. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
