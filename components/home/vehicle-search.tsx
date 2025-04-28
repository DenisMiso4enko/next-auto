'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function VehicleSearch() {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const { toast } = useToast();
  
  // Mock data - in a real app this would come from your database
  const years = Array.from({ length: 25 }, (_, i) => (new Date().getFullYear() - i).toString());
  const makes = ['Audi', 'BMW', 'Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Lexus', 'Mazda', 'Mercedes', 'Nissan', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen'];
  const models = ['A4', 'Accord', 'Camry', 'Civic', 'Corolla', 'F-150', 'Model 3', 'Mustang', 'Outback', 'RAV4', 'Silverado', 'Sonata', 'X5'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !make || !model) {
      toast({
        title: "Please select all fields",
        description: "Year, make, and model are required to find compatible parts.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Vehicle selected",
      description: `Finding parts for ${year} ${make} ${model}`,
    });
    
    // Here you would typically redirect to a filtered shop page
    // router.push(`/shop?year=${year}&make=${make}&model=${model}`);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 py-10">
      <div className="container max-w-5xl">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">Find Parts for Your Vehicle</CardTitle>
            <CardDescription className="text-blue-100">
              Select your vehicle to see compatible parts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium">
                  Year
                </label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="make" className="text-sm font-medium">
                  Make
                </label>
                <Select 
                  value={make} 
                  onValueChange={setMake}
                  disabled={!year}
                >
                  <SelectTrigger id="make">
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent>
                    {makes.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-medium">
                  Model
                </label>
                <Select 
                  value={model} 
                  onValueChange={setModel}
                  disabled={!make}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit"
                className="h-full mt-auto"
                disabled={!year || !make || !model}
              >
                <Search className="h-4 w-4 mr-2" />
                Find Parts
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Not sure about your vehicle? <a href="/shop" className="text-blue-700 dark:text-blue-400 hover:underline">Browse all parts</a> or <a href="/vin-lookup" className="text-blue-700 dark:text-blue-400 hover:underline">search by VIN</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}