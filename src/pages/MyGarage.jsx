import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Car, Plus, Trash2, Search, Loader2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const YEARS = Array.from({ length: new Date().getFullYear() - 2009 }, (_, i) => 2010 + i).reverse();
const MAKES = ['Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 
  'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 
  'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mini', 
  'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'];

export default function MyGarage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [newVehicle, setNewVehicle] = useState({
    year: '',
    make: '',
    model: '',
    engine: '',
    nickname: ''
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await base44.entities.Vehicle.list('-created_date');
      setVehicles(data);
    } catch (err) {
      console.error('Error loading vehicles:', err);
    }
    setLoading(false);
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.year || !newVehicle.make || !newVehicle.model) {
      toast.error('Please fill in year, make, and model');
      return;
    }

    setSaving(true);
    try {
      await base44.entities.Vehicle.create({
        year: parseInt(newVehicle.year),
        make: newVehicle.make,
        model: newVehicle.model,
        engine: newVehicle.engine,
        nickname: newVehicle.nickname
      });
      toast.success('Vehicle added to garage!');
      setDialogOpen(false);
      setNewVehicle({ year: '', make: '', model: '', engine: '', nickname: '' });
      loadVehicles();
    } catch (err) {
      toast.error('Failed to add vehicle');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.Vehicle.delete(id);
      toast.success('Vehicle removed from garage');
      loadVehicles();
    } catch (err) {
      toast.error('Failed to remove vehicle');
    }
  };

  const handleSearchParts = (vehicle) => {
    const query = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.engine || ''}`.trim();
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}&year=${vehicle.year}&make=${vehicle.make}&model=${vehicle.model}`);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[#FF6B35] text-lg font-semibold mb-4">My Garage</h1>
          <div className="mb-6">
            <h2 className="text-white text-xl font-bold mb-1">My Vehicles</h2>
            <p className="text-gray-500 text-sm">Manage your vehicle fleet</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-orange-500" />
                  Add New Vehicle
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Select value={newVehicle.year} onValueChange={(v) => setNewVehicle({...newVehicle, year: v})}>
                    <SelectTrigger className="bg-[#222] border-[#444]">
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
                  
                  <Select value={newVehicle.make} onValueChange={(v) => setNewVehicle({...newVehicle, make: v})}>
                    <SelectTrigger className="bg-[#222] border-[#444]">
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
                </div>
                
                <Input
                  placeholder="Model (e.g., F-150, Camry)"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                  className="bg-[#222] border-[#444] text-white"
                />
                
                <Input
                  placeholder="Engine (optional, e.g., 3.5L V6)"
                  value={newVehicle.engine}
                  onChange={(e) => setNewVehicle({...newVehicle, engine: e.target.value})}
                  className="bg-[#222] border-[#444] text-white"
                />
                
                <Input
                  placeholder="Nickname (optional, e.g., Daily Driver)"
                  value={newVehicle.nickname}
                  onChange={(e) => setNewVehicle({...newVehicle, nickname: e.target.value})}
                  className="bg-[#222] border-[#444] text-white"
                />
                
                <Button
                  onClick={handleAddVehicle}
                  disabled={saving}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Add Vehicle
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vehicle List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">No Vehicles Yet</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
              Create your first vehicle to organize parts and track repair progress
            </p>
            <Button onClick={() => setDialogOpen(true)} className="bg-[#FF6B35] hover:bg-[#E85D2A] text-white rounded-xl px-6">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle, idx) => (
              <div 
                key={vehicle.id}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-[#FF6B35] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{vehicle.year}</p>
                      <h3 className="text-white font-bold text-base">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5">{vehicle.engine || '45,230 miles'}</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  {vehicle.nickname && (
                    <div className="inline-block bg-[#FF6B35] px-3 py-1 rounded-md text-white text-xs font-semibold">
                      {vehicle.nickname}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-gray-600 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
            
            <button
              onClick={() => setDialogOpen(true)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 flex items-center justify-center gap-2 active:bg-[#222]"
            >
              <Plus className="w-5 h-5 text-[#FF6B35]" />
              <span className="text-[#FF6B35] font-semibold">Add Vehicle</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}