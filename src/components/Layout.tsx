import React from 'react';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          <Separator className="mt-4" />
        </div>
        <Card className="p-6">
          {children}
        </Card>
      </div>
    </div>
  );
}