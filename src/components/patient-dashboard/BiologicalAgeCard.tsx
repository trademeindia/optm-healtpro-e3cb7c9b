
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface BiologicalAgeCardProps {
  biologicalAge: number;
  chronologicalAge: number;
}

export const BiologicalAgeCard: React.FC<BiologicalAgeCardProps> = ({
  biologicalAge,
  chronologicalAge
}) => {
  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Biological Age</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="text-center mt-4">
          <p className="text-3xl font-semibold">{biologicalAge}</p>
          <p className="text-sm text-muted-foreground">Chronological Age: {chronologicalAge}</p>
        </div>
        <Progress value={(biologicalAge / chronologicalAge) * 100} className="w-full mt-4" />
        <p className="text-xs text-muted-foreground mt-2">
          {biologicalAge <= chronologicalAge ? "You're aging well!" : "Consider lifestyle adjustments."}
        </p>
      </CardContent>
    </Card>
  );
};
