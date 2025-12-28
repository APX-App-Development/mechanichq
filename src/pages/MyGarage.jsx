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
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[#FF6B35] font-bold text-xl mb-2">My Garage</h1>
            <h2 className="text-white font-semibold text-2xl mb-1">My Vehicles</h2>
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
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg mb-2">No vehicles in your garage</h3>
            <p className="text-gray-400 text-sm mb-6">Add your first vehicle to quickly search for parts</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {vehicles.map((vehicle, idx) => (
              <Card 
                key={vehicle.id} 
                className="bg-[#1a1a1a] border-[#333] hover:border-orange-500/50 transition-all duration-200 card-hover rounded-2xl animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      {vehicle.nickname && (
                        <p className="text-orange-500 text-sm font-medium mt-0.5">{vehicle.nickname}</p>
                      )}
                      {vehicle.engine && (
                        <p className="text-gray-400 text-sm mt-1">{vehicle.engine}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => handleSearchParts(vehicle)}
                    className="w-full h-12 tap-target bg-[#222] hover:bg-[#333] text-white border border-[#444] rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search Parts
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}