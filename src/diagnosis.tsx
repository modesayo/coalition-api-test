import React, { useState, useEffect, useContext } from "react";
import { Table } from "antd";
import { PatientContext } from "./indexcontst";
interface Diagnosis {
  key: string;
  problem: string;
  description: string;
  status: string;
}

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

const DiagnosticList: React.FC = () => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
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
      .then((data: PatientData[]) => {
        // changed to PatientData[]
        if (data && data.length > 0) {
          const diagnosticList = data[selectedPatientIndex].diagnostic_list;
          const diagnosesData = diagnosticList.map((diagnosis, index) => ({
            key: `${index + 1}`,
            problem: diagnosis.name,
            description: diagnosis.description,
            status: diagnosis.status,
          }));
          setDiagnoses(diagnosesData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [selectedPatientIndex]);

  const columns = [
    {
      title: "Problem/Diagnosis",
      dataIndex: "problem",
      key: "problem",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];
  return (
    <div className="bg-white mt-[32px] rounded-lg shadow-md p-4  mx-auto">
      <h2 className="text-lg font-bold mb-4">Diagnostic List</h2>
      <Table
        dataSource={diagnoses}
        columns={columns}
        pagination={false}
        loading={loading}
        className="custom-table-header"
        scroll={{ y:"300px" }} // set a fixed height of 300px and enable scrolling
        style={{ overflowY: "auto" }}
        
      />
    </div>
  );
};

export default DiagnosticList;
