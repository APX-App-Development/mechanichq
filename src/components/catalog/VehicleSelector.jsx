import React, { useState } from 'react';
import { Car, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { vehicleYears, vehicleMakes, vehicleModels, vehicleEngines } from './VehicleData';

export default function VehicleSelector({ onSelect, savedVehicles = [] }) {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [engine, setEngine] = useState('');

  const availableModels = make ? (vehicleModels[make] || []) : [];
  const availableEngines = model ? (vehicleEngines[model] || vehicleEngines['default']) : [];

  const handleApply = () => {
    if (year && make && model) {
      onSelect({ year, make, model, engine });
    }
  };

  const handleMakeChange = (newMake) => {
    setMake(newMake);
    setModel('');
    setEngine('');
  };

  const handleModelChange = (newModel) => {
    setModel(newModel);
    setEngine('');
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Car className="w-5 h-5 text-orange-500" />
        <h3 className="text-white font-semibold">Select Your Vehicle for Exact Fit</h3>
      </div>

      {/* Saved Vehicles */}
      {savedVehicles.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Quick Select:</p>
          <div className="flex flex-wrap gap-2">
            {savedVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => onSelect(vehicle)}
                className="px-3 py-1.5 bg-[#222] hover:bg-orange-500 border border-[#444] rounded-lg text-sm text-white transition-colors"
              >
                {vehicle.year} {vehicle.make} {vehicle.model}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {vehicleYears.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={make} onValueChange={handleMakeChange}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white">
            <SelectValue placeholder="Make" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {vehicleMakes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={model} onValueChange={handleModelChange} disabled={!make}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {availableModels.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={engine} onValueChange={setEngine} disabled={!model}>
          <SelectTrigger className="bg-[#222] border-[#444] text-white">
            <SelectValue placeholder="Engine" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {availableEngines.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleApply}
        disabled={!year || !make || !model}
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        <Check className="w-4 h-4 mr-2" />
        Apply Vehicle - Show Guaranteed Fit Parts
      </Button>
    </div>
  );
}