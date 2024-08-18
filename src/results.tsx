import React, { useState, useEffect, useContext } from 'react';
import { Card, List, Typography } from 'antd';
import { PatientContext } from './indexcontst';
interface PatientData {
  id: number;
  name: string;
  gender: string;
  age: number;
  profile_picture: string;
  date_of_birth: string;
  phone_number: string;
  emergency_contact: string;
  insurance_type: string;
  diagnosis_history: any[];
  diagnostic_list: {
    name: string;
    description: string;
    status: string;
  }[];
  lab_results: string[];
}

const LabResults: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData[] | null>(null);
  const { selectedPatientIndex } = useContext(PatientContext);
  useEffect(() => {
    const username = "coalition";
    const password = "skills-test";
    const auth = `Basic ${btoa(`${username}:${password}`)}`;

    fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPatientData(data);
      })
      .catch((error) => console.error(error));
  }, [selectedPatientIndex]);

  return (
    <Card className='mx-[17px] mt-[32px]' >
      {patientData && (
        <div>
          <Typography.Title level={4}>Lab Results</Typography.Title>
          <List
            dataSource={patientData[selectedPatientIndex].lab_results}
            renderItem={(labResult) => (
              <List.Item>
                <Typography.Text>{labResult}</Typography.Text>
              </List.Item>
            )}
            style={{ height: 300, overflow: 'auto' }}
        
          />
        </div>
      )}
    </Card>
  );
};

export default LabResults;