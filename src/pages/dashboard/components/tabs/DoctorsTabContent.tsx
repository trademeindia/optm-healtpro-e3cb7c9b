
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, Phone, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Example doctors data
const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    availability: "Mon, Wed, Fri",
    patients: 45,
    rating: 4.8,
    status: "available",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    availability: "Tue, Thu",
    patients: 32,
    rating: 4.6,
    status: "busy",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    availability: "Mon - Fri",
    patients: 58,
    rating: 4.9,
    status: "available",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    availability: "Wed, Thu, Fri",
    patients: 40,
    rating: 4.7,
    status: "off",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialty: "Dermatology",
    availability: "Mon, Tue, Wed",
    patients: 37,
    rating: 4.5,
    status: "available",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg"
  }
];

const DoctorsTabContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctorsData.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>;
      case 'busy':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Busy</Badge>;
      case 'off':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Off Duty</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Doctors</h2>
        <Button>Add New Doctor</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Medical Staff</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search doctors..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={doctor.avatar} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-muted-foreground">Rating: {doctor.rating}/5</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.availability}</TableCell>
                  <TableCell>{doctor.patients}</TableCell>
                  <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsTabContent;
