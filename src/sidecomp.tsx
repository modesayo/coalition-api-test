import React, { useContext, useEffect, useState } from 'react';
import { PatientContext }  from './indexcontst';
interface Patient {
  name: string;
  gender: string;
  age: number;
  profile_picture: string; // add this property to store the profile picture URL
}

const Sidebar: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false); // add this state to track search bar visibility
  const username = 'coalition'; // replace with your actual username
  const password = 'skills-test'; // replace with your actual password
  const { handlePatientClick } = useContext(PatientContext);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        });
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchProfilePictures = async () => {
      patients.forEach(async (patient) => {
        try {
          const response = await fetch(`https://fedskillstest.coalitiontechnologies.workers.dev/${patient.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            },
          });
          const profilePictureUrl = await response.json();
          patient.profile_picture = profilePictureUrl;
        } catch (error) {
          console.error(`Error fetching profile picture for ${patient.name}:`, error);
        }
      });
    };

    fetchProfilePictures();
  }, [patients]);

  useEffect(() => {
    const filtered = patients.filter((patient) => {
      const patientName = patient.name.toLowerCase();
      const patientGender = patient.gender.toLowerCase();
      const patientAge = patient.age.toString();
      const searchTermLower = searchTerm.toLowerCase();
      return (
        patientName.includes(searchTermLower) ||
        patientGender.includes(searchTermLower) ||
        patientAge.includes(searchTermLower)
      );
    });
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchIconClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <div className="w-[23%] h-[1054px] m-4 rounded-lg bg-white p-1 border-r border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Patients</h2>
        <span className="cursor-pointer" onClick={handleSearchIconClick}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
      {showSearchBar && (
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search patients..."
          className="w-full py-2 pl-10 text-sm text-black rounded-lg mb-4"
        />
      )}
      <div className="h-[950px] overflow-y-auto"> {/* Add a fixed height and overflow-y: auto */}
        <div id="patient-list">
          {filteredPatients.map((patient, index) => (
            <div key={index}  onClick={() => handlePatientClick(index)} className="flex justify-between items-center py-2 border-none border-gray-300">
              <div className="flex items-center">
                <img src={patient.profile_picture} alt={patient.name} className="w-12 h-12 rounded-full mr-4" />
                <div className="flex flex-col">
                  <span className="font-bold">{patient.name}</span>
                  <span className="text-gray-600">{`${patient.gender}, ${patient.age}`}</span>
                </div>
              </div>
              <span className="text-blue-500 cursor-pointer">...</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;