import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Disc, Droplet, Zap, Battery, RefreshCw, RotateCw, Search } from 'lucide-react';

const YEARS = Array.from({ length: new Date().getFullYear() + 1 - 2010 }, (_, i) => 2010 + i).reverse();
const MAKES = ['Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 
  'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 
  'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mini', 
  'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'];

const COMMON_JOBS = [
  { id: 'brakes', name: 'Brake Pads & Rotors', icon: Disc, search: 'front brake pads rotors' },
  { id: 'oil', name: 'Oil Change', icon: Droplet, search: 'oil filter oil change kit' },
  { id: 'spark', name: 'Spark Plugs', icon: Zap, search: 'spark plugs ignition' },
  { id: 'battery', name: 'Battery', icon: Battery, search: 'car battery replacement' },
  { id: 'alternator', name: 'Alternator', icon: RefreshCw, search: 'alternator replacement' },
  { id: 'belt', name: 'Serpentine Belt', icon: RotateCw, search: 'serpentine belt drive belt' },
];

export default function CommonJobs({ savedVehicles = [] }) {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  const handleJobClick = (job) => {
    setSelectedJob(job);
    if (savedVehicles.length > 0) {
      // Use first saved vehicle
      const v = savedVehicles[0];
      const query = `${job.search} ${v.year} ${v.make} ${v.model}`;
      navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}&year=${v.year}&make=${v.make}&model=${v.model}`);
    } else {
      setDialogOpen(true);
    }
  };

  const handleSearch = () => {
    if (year && make && model && selectedJob) {
      const query = `${selectedJob.search} ${year} ${make} ${model}`;
      navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}&year=${year}&make=${make}&model=${model}`);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {COMMON_JOBS.map((job, idx) => (
          <button
            key={job.id}
            onClick={() => handleJobClick(job)}
            className="flex flex-col items-center gap-3 p-5 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#e31e24]/50 rounded-2xl transition-all duration-200 group card-hover tap-target animate-fade-in-up active:scale-[0.97]"
            style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
          >
            <div className="w-14 h-14 bg-[#e31e24]/10 group-hover:bg-[#e31e24]/20 rounded-xl flex items-center justify-center transition-all duration-200">
              <job.icon className="w-7 h-7 text-[#e31e24]" />
            </div>
            <span className="text-white text-sm font-medium text-center leading-tight">{job.name}</span>
          </button>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Your Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="bg-[#222] border-[#444]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-[#222] border-[#444] max-h-60">
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y.toString()} className="text-white hover:bg-[#333]">{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={make} onValueChange={setMake}>
              <SelectTrigger className="bg-[#222] border-[#444]">
                <SelectValue placeholder="Make" />
              </SelectTrigger>
              <SelectContent className="bg-[#222] border-[#444] max-h-60">
                {MAKES.map((m) => (
                  <SelectItem key={m} value={m} className="text-white hover:bg-[#333]">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="text"
              placeholder="Model (e.g., F-150, Camry)"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white placeholder-gray-500"
            />
            <Button
              onClick={handleSearch}
              disabled={!year || !make || !model}
              className="w-full bg-[#e31e24] hover:bg-[#c91a1f]"
            >
              <Search className="w-4 h-4 mr-2" />
              Find {selectedJob?.name}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}