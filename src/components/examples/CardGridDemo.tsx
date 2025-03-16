
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardGrid } from '@/components/ui/card-grid';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CardGridDemo = () => {
  const [layout, setLayout] = useState<'two-col' | 'three-col' | 'four-col'>('two-col');
  const [cardCount, setCardCount] = useState(6);
  
  const generateCards = (count: number) => {
    const cards = [];
    for (let i = 1; i <= count; i++) {
      cards.push(
        <Card key={i}>
          <CardHeader>
            <CardTitle>Card {i}</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here, demonstrating how the grid responds to different layouts.</p>
            {i % 2 === 0 && <p className="mt-2">This card has a bit more content to show how equal height works.</p>}
          </CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>
      );
    }
    return cards;
  };
  
  const getColumnCount = () => {
    switch (layout) {
      case 'two-col': return 2;
      case 'three-col': return 3;
      case 'four-col': return 4;
      default: return 2;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Card Grid Demo</h2>
        <Tabs value={layout} onValueChange={(v) => setLayout(v as any)}>
          <TabsList>
            <TabsTrigger value="two-col">2 Columns</TabsTrigger>
            <TabsTrigger value="three-col">3 Columns</TabsTrigger>
            <TabsTrigger value="four-col">4 Columns</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <CardGrid columns={getColumnCount()} gap="md">
        {generateCards(cardCount)}
      </CardGrid>
      
      <div className="flex justify-center space-x-4">
        <Button onClick={() => setCardCount(Math.max(cardCount - 1, 1))}>Remove Card</Button>
        <Button onClick={() => setCardCount(cardCount + 1)}>Add Card</Button>
      </div>
    </div>
  );
};

export default CardGridDemo;
