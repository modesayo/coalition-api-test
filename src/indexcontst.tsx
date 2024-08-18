import { createContext, ReactNode, useState } from 'react';

interface PatientContextProps {
  selectedPatientIndex: number;
  handlePatientClick: (index: number) => void;
}

export const PatientContext = createContext<PatientContextProps>({
  selectedPatientIndex: 0,
  handlePatientClick: () => {},
});

interface PatientProviderProps {
  children: ReactNode;
}

const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [selectedPatientIndex, setSelectedPatientIndex] = useState<number>(0);

  const handlePatientClick = (index: number) => {
    setSelectedPatientIndex(index);
    console.log(`Patient ${index} clicked!`);
  };

  return (
    <PatientContext.Provider value={{ selectedPatientIndex, handlePatientClick }}>
      {children}
    </PatientContext.Provider>
  );
};

export default PatientProvider;