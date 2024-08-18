import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement);

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    "CSPM ": {
      widgets: [
        {
          name: "Cloud Accounts",
          text: "Connected: 2, Not Connected: 2",
          value1: 0,
          value2: 0,
        },
        {
          name: "Cloud Account Risk Assessment",
          text: "Failed: 1689, Warning: 681, Not available: 36, Passed: 7253",
          value1: 0,
          value2: 0,
        },
        {
          id: "add_widget",
          name: "",
          text: "Add Widget",
          value1: 0,
          value2: 0,
        },
      ],
    },
    "CWPP ": {
      widgets: [
        {
          name: "Top 5 Namespace Specific Alert",
          text: "Connected: 5, Not Connected: 2",
          value1: 0,
          value2: 0,
        },
        {
          name: "Workload Alert",
          text: "Failed: 19, Warning: 61, Not available: 6, Passed: 53",
          value1: 0,
          value2: 0,
        },
        {
          id: "add_widget",
          name: "",
          text: "Add Widget",
          value1: 0,
          value2: 0,
        },
      ],
    },
    "Registry Scan": {
      widgets: [
        { id: "Image Risk Assessment",
          name: "Image Risk Assessment",
          text: "Total Vulnerabilities: 14",
          value1: 0,
          value2: 0,
        },
        {
          id: "image_security_issues",
          name: "Image Security Issues",
          text: "Total Images: 2",
          value1: 0,
          value2: 0,
        },
        {
          id: "add_widget",
          name: "",
          text: "Add Widget",
          value1: 0,
          value2: 0,
        },
      ],
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddWidgetForm, setShowAddWidgetForm] = useState(false);
  const [selectedGraphs, setSelectedGraphs] = useState([]);
  const [newWidget, setNewWidget] = useState({
    category: "",
    graphName: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewWidget((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setSelectedGraphs((prev) => [...prev, name]);
    } else {
      setSelectedGraphs((prev) =>
        prev.filter((graphName) => graphName !== name)
      );
    }
  };

  const handleAddWidget = () => {
    setShowAddWidgetForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { category } = newWidget;

    if (category && selectedGraphs.length > 0) {
      selectedGraphs.forEach((graphName) => {
        const newWidgetObject = {
          name: graphName,
          text: "",
          value1: 0,
          value2: 0,
        };

        setDashboardData((prevData) => {
          const updatedData = { ...prevData };
          if (updatedData[category]) {
            updatedData[category].widgets.splice(
              updatedData[category].widgets.length - 1,
              0,
              newWidgetObject
            );
          }
          return updatedData;
        });
      });

      setNewWidget({ category: "", graphName: "" });
      setSelectedGraphs([]);
      setShowAddWidgetForm(false);
    }
  };

  const removeWidget = (category, widgetId) => {
    setDashboardData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[category].widgets = updatedData[category].widgets.filter(
        (widget) => widget.id !== widgetId
      );
      return updatedData;
    });
  };

  const parseWidgetText = (text) => {
    const parts = text.split(",").map((part) => {
      const [label, value] = part.split(":").map((item) => item.trim());
      return { label, value: Number(value) };
    });
    return parts;
  };

  const renderWidgetContent = (widget) => {
    const parsedData = parseWidgetText(widget.text);

    return (
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">ID: {widget.id}</p>
        <h3 className="text-md font-semibold mb-2">{widget.name}</h3>
        {widget.id === "image_risk_assessment" || widget.id === "image_security_issues" ? (
          <Bar
            data={{
              labels: [widget.name],
              datasets: [
                {
                  label: widget.name,
                  data: [widget.value1],
                  backgroundColor: ["#FF6384"],
                },
              ],
            }}
          />
        ) : parsedData.length === 2 ? (
          <Doughnut
            data={{
              labels: parsedData.map((d) => d.label),
              datasets: [
                {
                  data: parsedData.map((d) => d.value),
                  backgroundColor: ["#36A2EB", "#FF6384"],
                },
              ],
            }}
          />
        ) : parsedData.length > 2 ? (
          <Pie
            data={{
              labels: parsedData.map((d) => d.label),
              datasets: [
                {
                  label: "Values",
                  data: parsedData.map((d) => d.value),
                  backgroundColor: parsedData.map((d, index) =>
                    ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5]
                  ),
                },
              ],
            }}
          />
        ) : (
          <p>{widget.text}</p>
        )}
      </div>
    );
  };

  const filteredDashboardData = Object.entries(dashboardData).reduce(
    (result, [category, data]) => {
      const filteredWidgets = data.widgets.filter(
        (widget) =>
          widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          widget.text.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredWidgets.length > 0) {
        result[category] = { widgets: filteredWidgets };
      }

      return result;
    },
    {}
  );

  return (
    <div className="Dashboard p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="relative w-80">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            className="p-2 pl-10 border rounded-md w-full"
            placeholder="Search widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(filteredDashboardData).length > 0 ? (
          Object.entries(filteredDashboardData).map(([category, data]) => (
            <div
              key={category}
              className="category-box flex flex-col p-4"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                {category}
              </h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {data.widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className={`widget-box relative ${widget.id === "add_widget" ? "bg-gray-100" : "bg-white"}`}
                  >
                    {widget.id !== "add_widget" && (
                      <button
                        onClick={() => removeWidget(category, widget.id)}
                        className="absolute top-2 right-2 text-red-500"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                    {widget.id === "add_widget" ? (
                      <button
                        onClick={() => handleAddWidget(category)}
                        className="add-widget-button w-full h-full flex items-center justify-center p-4 border border-dashed border-gray-400 rounded-lg"
                      >
                        <span className="text-gray-500">Add Widget</span>
                      </button>
                    ) : (
                      renderWidgetContent(widget)
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No widgets found.</p>
        )}
      </div>
      {showAddWidgetForm && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
    style={{ width: "50%", height: "100%", flexDirection: "row-reverse" }}
  >
    <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full flex flex-col">
      {/* Close button */}
      <button
        onClick={() => setShowAddWidgetForm(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Personalize your dashboard by adding the following widget
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-medium mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newWidget.category}
            onChange={handleFormChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="">Select a category</option>
            {Object.keys(dashboardData).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Graph Name
          </label>
          {newWidget.category &&
            dashboardData[newWidget.category].widgets.map((widget) => (
              <div key={widget.name} className="flex items-center">
                <input
                  type="checkbox"
                  name={widget.name}
                  checked={selectedGraphs.includes(widget.name)}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label>{widget.name}</label>
              </div>
            ))}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Widget
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default DashboardPage;
