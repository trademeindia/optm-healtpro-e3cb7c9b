import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardGrid } from "@/components/ui/card-grid"

interface ExampleCardProps {
  title: string
  height?: "normal" | "tall"
}

const ExampleCard: React.FC<ExampleCardProps> = ({ title, height = "normal" }) => {
  return (
    <Card className={height === "tall" ? "h-48" : "h-32"}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>A simple card example</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the content of the card.</p>
      </CardContent>
    </Card>
  )
}

const CardGridDemo = () => {
  const cardData = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    description: `Description for card ${i + 1}`,
  }))

  return (
    <div className="space-y-12 py-8">
      {/* Example 1: Basic usage */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Card Grid</h2>
        <CardGrid columns={2} gap="md">
          {Array.from({ length: 4 }).map((_, i) => (
            <ExampleCard key={i} title={`Card ${i + 1}`} />
          ))}
        </CardGrid>
      </section>

      {/* Example 2: Responsive columns */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Responsive Columns</h2>
        <CardGrid columns="responsive" gap="lg">
          {cardData.map((card) => (
            <Card key={card.id} className="h-32">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content for {card.title}</p>
              </CardContent>
            </Card>
          ))}
        </CardGrid>
      </section>

      {/* Example 3: Different gap sizes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Different Gap Sizes</h2>
        <div className="flex space-x-4">
          <CardGrid columns={2} gap="sm">
            {Array.from({ length: 2 }).map((_, i) => (
              <ExampleCard key={i} title={`Card ${i + 1}`} />
            ))}
          </CardGrid>
          <CardGrid columns={2} gap="md">
            {Array.from({ length: 2 }).map((_, i) => (
              <ExampleCard key={i} title={`Card ${i + 1}`} />
            ))}
          </CardGrid>
          <CardGrid columns={2} gap="lg">
            {Array.from({ length: 2 }).map((_, i) => (
              <ExampleCard key={i} title={`Card ${i + 1}`} />
            ))}
          </CardGrid>
        </div>
      </section>
      
      {/* Example with equalHeight prop */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Equal Height Cards</h2>
        <CardGrid columns={4} gap="lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <ExampleCard key={i} title={`Card ${i + 1}`} height={i % 2 === 0 ? "tall" : "normal"} />
          ))}
        </CardGrid>
      </section>
    </div>
  )
}

export default CardGridDemo
