import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Car, Search } from 'lucide-react';

const YEARS = Array.from({ length: new Date().getFullYear() - 2009 }, (_, i) => 2010 + i).reverse();

const MAKES = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 
  'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 
  'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mini', 
  'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

const MODELS_BY_MAKE = {
  'Ford': ['F-150', 'F-250', 'F-350', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Bronco', 'Ranger', 'Expedition', 'Focus', 'Fusion', 'Taurus', 'Maverick'],
  'Chevrolet': ['Silverado 1500', 'Silverado 2500', 'Camaro', 'Corvette', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Colorado', 'Malibu', 'Impala', 'Cruze', 'Bolt EV'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', '4Runner', 'Prius', 'Sienna', 'Avalon', 'Supra', 'GR86', 'Sequoia'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey', 'Ridgeline', 'Passport', 'Fit', 'Insight'],
  'Dodge': ['Charger', 'Challenger', 'Durango', 'Journey', 'Grand Caravan', 'Ram 1500', 'Ram 2500'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Wagoneer'],
  'Ram': ['1500', '2500', '3500', 'ProMaster'],
  'Nissan': ['Altima', 'Maxima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Frontier', 'Titan', '370Z', 'Leaf', 'Kicks', 'Armada'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'M3', 'M5', 'Z4', 'i4', 'iX'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'A-Class', 'CLA', 'AMG GT'],
};

export default function VehicleSelector({ onSelect, compact = false }) {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [engine, setEngine] = useState('');

  const models = MODELS_BY_MAKE[make] || ['Sedan', 'SUV', 'Truck', 'Coupe', 'Other'];

  const handleSearch = () => {
    if (year && make && model) {
      onSelect({ year: parseInt(year), make, model, engine });
    }
  };

  return (
    <div className={`bg-[#1a1a1a] border border-[#333] rounded-xl p-5 ${compact ? '' : 'max-w-4xl mx-auto'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Car className="w-5 h-5 text-[#e31e24]" />
        <span className="text-white font-semibold">Shop By Vehicle</span>
      </div>
      
      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'}`}>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-[#222] border-[#444]">
            {YEARS.map((y) => (
              <SelectItem key={y} value={y.toString()} className="text-white hover:bg-[#333]">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={make} onValueChange={(v) => { setMake(v); setModel(''); }}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white">
            <SelectValue placeholder="Make" />
          </SelectTrigger>
          <SelectContent className="bg-[#222] border-[#444] max-h-60">
            {MAKES.map((m) => (
              <SelectItem key={m} value={m} className="text-white hover:bg-[#333]">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={model} onValueChange={setModel} disabled={!make}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent className="bg-[#222] border-[#444] max-h-60">
            {models.map((m) => (
              <SelectItem key={m} value={m} className="text-white hover:bg-[#333]">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!compact && (
          <Select value={engine} onValueChange={setEngine}>
            <SelectTrigger className="bg-[#222] border-[#444] text-white">
              <SelectValue placeholder="Engine (Optional)" />
            </SelectTrigger>
            <SelectContent className="bg-[#222] border-[#444]">
              <SelectItem value="2.0L" className="text-white hover:bg-[#333]">2.0L</SelectItem>
              <SelectItem value="2.5L" className="text-white hover:bg-[#333]">2.5L</SelectItem>
              <SelectItem value="3.0L" className="text-white hover:bg-[#333]">3.0L</SelectItem>
              <SelectItem value="3.5L" className="text-white hover:bg-[#333]">3.5L</SelectItem>
              <SelectItem value="5.0L V8" className="text-white hover:bg-[#333]">5.0L V8</SelectItem>
              <SelectItem value="5.7L V8" className="text-white hover:bg-[#333]">5.7L V8</SelectItem>
              <SelectItem value="6.2L V8" className="text-white hover:bg-[#333]">6.2L V8</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Button
        onClick={handleSearch}
        disabled={!year || !make || !model}
        className="w-full mt-4 bg-[#e31e24] hover:bg-[#c91a1f] text-white font-semibold h-11"
      >
        <Search className="w-4 h-4 mr-2" />
        Search Parts
      </Button>
    </div>
  );
}