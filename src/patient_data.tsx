import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

interface DiagnosisHistory {
  month: string;
  year: number;
  blood_pressure: {
    systolic: {
      value: number;
      levels: string;
    };
    diastolic: {
      value: number;
      levels: string;
    };
  };
  heart_rate: {
    value: number;
    levels: string;
  };
  respiratory_rate: {
    value: number;
    levels: string;
  };
  temperature: {
    value: number;
    levels: string;
  };
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
  diagnosis_history: DiagnosisHistory[];
}

const HealthCard: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData[] | null>(null);
  const [data, setData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "Systolic",
        data: [] as (number | null)[],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Diastolic",
        data: [] as number[],
        borderColor: "transparent",
        backgroundColor: "transparent",
        fill: true,
      },
    ],
  });
  const [options] = useState({
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          filter: () => false,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // remove vertical lines
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.5)", // thicken horizontal lines
          lineWidth: 2,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // adjust this value to control the curvature
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    width: "100%", // make the width responsive
    height: "300px",
  });
  const [selectedRange, setSelectedRange] = useState("All");

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
  }, []);

  useEffect(() => {
    if (
      patientData &&
      patientData.length > 0 &&
      patientData[0].diagnosis_history
    ) {
      const diagnosisHistory = patientData[0].diagnosis_history;
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const previousMonths = [];
      for (let i = 0; i < 12; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month <= 0) {
          month += 12;
          year -= 1;
        }
        previousMonths.push({ month, year });
      }

      const labels: string[] = [];
      const systolicData: (number | null)[] = [];
      const diastolicData: (number | null)[] = [];

      const filteredMonths = previousMonths.filter((month) => {
        if (selectedRange === "All") return true;
        const rangeValue = parseInt(selectedRange);
        return (
          month.month >= currentMonth - rangeValue + 1 &&
          month.month <= currentMonth
        );
      });

      filteredMonths.forEach((month) => {
        const foundItem = diagnosisHistory.find(
          (item) =>
            item.month === getMonthName(month.month) && item.year === month.year
        );
        if (foundItem) {
          labels.push(`${foundItem.month} ${foundItem.year}`);
          systolicData.push(foundItem.blood_pressure.systolic.value);
          diastolicData.push(foundItem.blood_pressure.diastolic.value);
        } else {
          labels.push(`${getMonthName(month.month)} ${month.year}`);
          systolicData.push(null);
          diastolicData.push(null);
        }
      });

      setData({
        labels: labels.reverse(),
        datasets: [
          {
            label: "Systolic",
            data: systolicData.reverse(),
            borderColor: "#C26EB4",
            backgroundColor: "transparent",
            fill: true,
          },
          {
            label: "Diastolic",
            data: diastolicData.reverse() as (number | null)[],
            borderColor: "#7E6CAB",
            backgroundColor: "transparent",
            fill: true,
          },
        ],
      });
    }
  }, [patientData, selectedRange]);
  const getMonthName = (month: number) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month - 1];
  };
  if (!patientData || patientData.length === 0) {
    return <div>Loading...</div>;
  }
  const rangeOptions = [
    { value: "All", label: "Last 12 Months" },
    { value: "1", label: "current Month" },
    { value: "2", label: "Last Month" },
    { value: "3", label: "Last Month - 2" },
    { value: "4", label: "Last Month - 3" },
    { value: "5", label: "Last Month - 4" },
    { value: "6", label: "Last Month - 5" },
    { value: "7", label: "Last Month - 6" },
    { value: "8", label: "Last Month - 7" },
    { value: "9", label: "Last Month - 8" },
    { value: "10", label: "Last Month - 9" },
    { value: "11", label: "Last Month - 10" },
    { value: "12", label: "Last Month - 11" },
  ];

  return (
    <div className="mt-4 h-[] container bg-white shadow-lg  rounded-lg overflow-hidden">
      <div className="flex coulumn">
        <h2 className="text-xl mt-4 px-6 font-bold mb-2">
          Blood Pressure Chart
        </h2>
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="ml-auto border-black text-sm mt-4 mr-4 text-black custom-select"
        >
          {rangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="px-6 mb-4"></div>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-2/3 xl:w-2/3 p-4">
          <Line data={data} options={options} />
        </div>
        <div className="w-full mx-auto md:w-1/3 xl:w-1/3 p-4">
          <div>
            <div>
              <h2 className="flex">
                <span className="inline-block w-4 h-6 bg-[#C26EB4] rounded-full mr-2"></span>
                <span className="text-xl font-bold ">Systolic</span>
              </h2>
              <p className="text-4xl font-bold">
                {
                  patientData[0].diagnosis_history[0].blood_pressure.systolic
                    .value
                }
              </p>
              <p className="text-sm text-gray-500">
                {
                  patientData[0].diagnosis_history[0].blood_pressure.systolic
                    .levels
                }
              </p>
            </div>
            <div className="mt-4">
              <h2 className="flex">
                <span className="inline-block w-4 h-6 bg-[#7E6CAB] rounded-full mr-2"></span>
                <span className="text-xl font-bold ">Diastolic</span>
              </h2>
              <p className="text-4xl font-bold">
                {
                  patientData[0].diagnosis_history[0].blood_pressure.diastolic
                    .value
                }
              </p>
              <p className="text-sm text-gray-500">
                {
                  patientData[0].diagnosis_history[0].blood_pressure.systolic
                    .levels
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 p-4">
        <div className="flex-1 bg-blue-100 p-4 rounded-lg shadow-md ">
          <img
            src="respiratory rate.png"
            alt="Lungs Icon"
            className="w-[96px] h-[96px]  mb-2"
          />
          <h3 className="text-lg font-semibold">Respiratory Rate</h3>
          <p className="text-2xl font-bold">
            {patientData[0].diagnosis_history[0].respiratory_rate.value} bpm
          </p>
          <p className="text-sm text-gray-600">
            {patientData[0].diagnosis_history[0].respiratory_rate.levels}
          </p>
        </div>
        <div className="flex-1 bg-pink-100 p-4 rounded-lg shadow-md ">
          <img
            src="temperature.png"
            alt="Thermometer Icon"
            className="w-[96px] h-[96px]  mb-2"
          />
          <h3 className="text-lg font-semibold">Temperature</h3>
          <p className="text-2xl font-bold">
            {patientData[0].diagnosis_history[0].temperature.value}°F
          </p>
          <p className="text-sm text-gray-600">
            {patientData[0].diagnosis_history[0].temperature.levels}
          </p>
        </div>
        <div className="flex-1 bg-pink-200 p-4 rounded-lg shadow-md ">
          <img
            src="HeartBPM.png"
            alt="Heart Icon"
            className="w-[96px] h-[96px] mb-2"
          />
          <h3 className="text-lg font-semibold">Heart Rate</h3>
          <p className="text-2xl font-bold">
            {patientData[0].diagnosis_history[0].heart_rate.value}bpm
          </p>
          <p className="text-sm text-gray-600">
            {patientData[0].diagnosis_history[0].heart_rate.levels}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthCard;
