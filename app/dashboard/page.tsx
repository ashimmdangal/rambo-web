"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  Plus,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Modal from "@/components/ui/Modal";

// Mock revenue data
const revenueData = [
  { month: "Jan", earnings: 45000 },
  { month: "Feb", earnings: 52000 },
  { month: "Mar", earnings: 48000 },
  { month: "Apr", earnings: 61000 },
  { month: "May", earnings: 55000 },
  { month: "Jun", earnings: 67000 },
  { month: "Jul", earnings: 72000 },
  { month: "Aug", earnings: 68000 },
  { month: "Sep", earnings: 75000 },
  { month: "Oct", earnings: 82000 },
  { month: "Nov", earnings: 78000 },
  { month: "Dec", earnings: 95000 },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly">("monthly");
  const [propertyData, setPropertyData] = useState({
    title: "",
    description: "",
    type: "HOUSE",
    category: "RENT",
    address: "",
    city: "",
    state: "",
    country: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
  });

  // Generate weekly data (last 8 weeks)
  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (7 - i) * 7);
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return {
      week: `Week ${8 - i}`,
      date: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      earnings: Math.floor(Math.random() * 20000) + 10000,
    };
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setPropertyData({
      ...propertyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else {
      // Submit property
      console.log("Property data:", propertyData);
      setIsAddPropertyOpen(false);
      setFormStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-display font-bold text-primary">Rambo</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-muted rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 bg-accent text-primary rounded-lg font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <Link
              href="/dashboard/properties"
              className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>My Properties</span>
            </Link>
            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              <span>Revenue</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-30 glassmorphism border-b border-border">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-display font-semibold text-primary">
              Owner Dashboard
            </h2>
            <button
              onClick={() => setIsAddPropertyOpen(true)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>List New Property</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-3xl font-display font-bold text-primary">
                    ${revenueData.reduce((sum, d) => sum + d.earnings, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-accent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Properties</p>
                  <p className="text-3xl font-display font-bold text-primary">12</p>
                </div>
                <Home className="w-12 h-12 text-accent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-3xl font-display font-bold text-primary">
                    ${revenueData[revenueData.length - 1].earnings.toLocaleString()}
                  </p>
                </div>
                <LayoutDashboard className="w-12 h-12 text-accent" />
              </div>
            </motion.div>
          </div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card p-6 rounded-lg border border-border shadow-sm mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display font-semibold text-primary">
                {timePeriod === "weekly" ? "Weekly Earnings" : "Monthly Earnings"}
              </h3>
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setTimePeriod("weekly")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timePeriod === "weekly"
                      ? "bg-accent text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimePeriod("monthly")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timePeriod === "monthly"
                      ? "bg-accent text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timePeriod === "weekly" ? weeklyData : revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey={timePeriod === "weekly" ? "date" : "month"}
                  stroke="#666"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#666"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Earnings"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={{ fill: "#D4AF37", r: 5 }}
                  activeDot={{ r: 8 }}
                  name="Earnings"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>

      {/* Add Property Modal */}
      <Modal
        isOpen={isAddPropertyOpen}
        onClose={() => {
          setIsAddPropertyOpen(false);
          setFormStep(1);
        }}
        title="List New Property"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    formStep >= step
                      ? "bg-accent border-accent text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      formStep > step ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Information */}
          {formStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Property Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={propertyData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Luxury Villa with Ocean View"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={propertyData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Describe your property..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={propertyData.category}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Reset type if current type is not allowed for new category
                      const newCategory = e.target.value as "RENT" | "BUY";
                      const allowedTypes = newCategory === "RENT" 
                        ? ["ROOM", "HOUSE", "APARTMENT", "VILLA"]
                        : ["HOUSE", "APARTMENT"];
                      if (!allowedTypes.includes(propertyData.type)) {
                        setPropertyData({ ...propertyData, category: newCategory, type: allowedTypes[0] });
                      } else {
                        setPropertyData({ ...propertyData, category: newCategory });
                      }
                    }}
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="RENT">Rent</option>
                    <option value="BUY">Buy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={propertyData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {propertyData.category === "RENT" ? (
                      <>
                        <option value="ROOM">Room</option>
                        <option value="HOUSE">House</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="VILLA">Villa</option>
                      </>
                    ) : (
                      <>
                        <option value="HOUSE">House</option>
                        <option value="APARTMENT">Apartment</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {formStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={propertyData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={propertyData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={propertyData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={propertyData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          )}

          {/* Step 3: Details & Pricing */}
          {formStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={propertyData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="500000"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={propertyData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={propertyData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Area (sqft)
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={propertyData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Photos
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photos"
                  />
                  <label
                    htmlFor="photos"
                    className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Click to upload property photos
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Videos (Optional)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    className="hidden"
                    id="videos"
                  />
                  <label
                    htmlFor="videos"
                    className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Click to upload property videos
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: MP4, MOV, AVI (max 100MB per video)
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            {formStep > 1 && (
              <button
                type="button"
                onClick={() => setFormStep(formStep - 1)}
                className="px-6 py-2.5 border border-border rounded-md text-foreground hover:bg-muted transition-colors"
              >
                Previous
              </button>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-6 py-2.5 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors"
              >
                {formStep === 3 ? "Submit Property" : "Next Step"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

