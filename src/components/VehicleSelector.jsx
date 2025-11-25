import React, { useState, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Search, Camera, ScanLine, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const YEARS = Array.from({ length: new Date().getFullYear() + 1 - 2010 }, (_, i) => 2010 + i).reverse();

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
  'Dodge': ['Charger', 'Challenger', 'Durango', 'Journey', 'Grand Caravan'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Wagoneer'],
  'Ram': ['1500', '2500', '3500', 'ProMaster'],
  'Nissan': ['Altima', 'Maxima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Frontier', 'Titan', '370Z', 'Leaf', 'Kicks', 'Armada'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'M3', 'M5', 'Z4', 'i4', 'iX'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'A-Class', 'CLA', 'AMG GT'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Ioniq 5', 'Ioniq 6'],
  'Kia': ['Forte', 'K5', 'Sportage', 'Sorento', 'Telluride', 'Seltos', 'EV6', 'Soul'],
};

const ENGINES_BY_MODEL = {
  'F-150': ['2.7L V6 EcoBoost', '3.5L V6 EcoBoost', '5.0L V8', '3.5L PowerBoost Hybrid', '3.3L V6'],
  'Camry': ['2.5L 4-Cyl', '3.5L V6', '2.5L Hybrid'],
  'Civic': ['1.5L Turbo', '2.0L 4-Cyl', '2.0L Turbo (Si/Type R)'],
  'Silverado 1500': ['2.7L Turbo', '4.3L V6', '5.3L V8', '6.2L V8', '3.0L Duramax Diesel'],
  'Accord': ['1.5L Turbo', '2.0L Turbo', '2.0L Hybrid'],
};

export default function VehicleSelector({ onSelect, compact = false }) {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [engine, setEngine] = useState('');
  const [vinInput, setVinInput] = useState('');
  const [scanningVin, setScanningVin] = useState(false);
  const [decodingVin, setDecodingVin] = useState(false);
  const fileInputRef = useRef(null);

  const models = MODELS_BY_MAKE[make] || [];
  const engines = ENGINES_BY_MODEL[model] || ['2.0L', '2.5L', '3.0L', '3.5L', '5.0L V8', '5.7L V8', '6.2L V8'];

  const handleSearch = () => {
    if (year && make && model) {
      onSelect({ year: parseInt(year), make, model, engine });
    }
  };

  const handleVinScan = async (imageFile) => {
    setScanningVin(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Extract the VIN (Vehicle Identification Number) from this image. A VIN is a 17-character alphanumeric code. Return ONLY the VIN, nothing else. If you cannot find a valid VIN, return "NOT_FOUND".`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            vin: { type: "string" }
          }
        }
      });

      if (result.vin && result.vin !== "NOT_FOUND" && result.vin.length === 17) {
        setVinInput(result.vin);
        await decodeVin(result.vin);
      } else {
        toast.error('Could not read VIN from image. Please try again or enter manually.');
      }
    } catch (err) {
      toast.error('Failed to scan VIN');
    }
    setScanningVin(false);
  };

  const decodeVin = async (vin) => {
    setDecodingVin(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Decode this VIN: ${vin}
        
Return the vehicle information in JSON format. VINs contain encoded information about the vehicle.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            year: { type: "number" },
            make: { type: "string" },
            model: { type: "string" },
            engine: { type: "string" },
            trim: { type: "string" }
          }
        }
      });

      if (result.year && result.make && result.model) {
        setYear(result.year.toString());
        setMake(result.make);
        setModel(result.model);
        if (result.engine) setEngine(result.engine);
        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
      }
    } catch (err) {
      toast.error('Failed to decode VIN');
    }
    setDecodingVin(false);
  };

  return (
    <div className={`bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 ${compact ? '' : 'max-w-4xl mx-auto'}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-[#e31e24]" />
          <span className="text-white font-semibold">Select Your Vehicle</span>
        </div>
        
        {/* VIN Scanner - Mobile */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleVinScan(e.target.files[0]);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanningVin}
            className="bg-transparent border-[#444] text-gray-300 hover:bg-[#222] hover:text-white md:hidden"
          >
            {scanningVin ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Camera className="w-4 h-4 mr-1.5" />
                Scan VIN
              </>
            )}
          </Button>
        </div>
      </div>

      {/* VIN Input Row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Enter VIN (17 characters)"
            value={vinInput}
            onChange={(e) => setVinInput(e.target.value.toUpperCase())}
            maxLength={17}
            className="bg-[#222] border-[#444] text-white pl-10 font-mono uppercase"
          />
        </div>
        <Button
          type="button"
          onClick={() => vinInput.length === 17 && decodeVin(vinInput)}
          disabled={vinInput.length !== 17 || decodingVin}
          className="bg-[#333] hover:bg-[#444] text-white"
        >
          {decodingVin ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Decode'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={scanningVin}
          className="hidden md:flex bg-transparent border-[#444] text-gray-300 hover:bg-[#222] hover:text-white"
        >
          {scanningVin ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Camera className="w-4 h-4 mr-1.5" />
              Scan
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-px bg-[#333]" />
        <span className="text-gray-500 text-sm">or select manually</span>
        <div className="flex-1 h-px bg-[#333]" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white h-12">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-[#222] border-[#444] max-h-60">
            {YEARS.map((y) => (
              <SelectItem key={y} value={y.toString()} className="text-white hover:bg-[#333]">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={make} onValueChange={(v) => { setMake(v); setModel(''); setEngine(''); }}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white h-12">
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

        <Select value={model} onValueChange={(v) => { setModel(v); setEngine(''); }} disabled={!make}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white h-12">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent className="bg-[#222] border-[#444] max-h-60">
            {models.length > 0 ? models.map((m) => (
              <SelectItem key={m} value={m} className="text-white hover:bg-[#333]">
                {m}
              </SelectItem>
            )) : (
              <SelectItem value="other" className="text-white hover:bg-[#333]">Other</SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select value={engine} onValueChange={setEngine} disabled={!model}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white h-12">
            <SelectValue placeholder="Engine/Trim" />
          </SelectTrigger>
          <SelectContent className="bg-[#222] border-[#444] max-h-60">
            {engines.map((e) => (
              <SelectItem key={e} value={e} className="text-white hover:bg-[#333]">
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleSearch}
        disabled={!year || !make || !model}
        className="w-full mt-5 bg-[#e31e24] hover:bg-[#c91a1f] text-white font-semibold h-12 text-base shadow-lg shadow-[#e31e24]/20"
      >
        <Search className="w-5 h-5 mr-2" />
        Find Parts for This Vehicle
      </Button>
    </div>
  );
}