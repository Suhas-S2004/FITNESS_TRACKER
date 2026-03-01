import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import type { FoodEntry } from "../types";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import {
  Loader2Icon,
  PlusIcon,
  SparkleIcon,
  Trash2Icon,
  Coffee,
  Sun,
  Moon,
  Utensils,
  UtensilsCrossedIcon,
} from "lucide-react";
import { quickActivitiesFoodLog } from "../assets/assets";
//mport mockApi from "../assets/mockApi";
import { toast } from "react-hot-toast";
import api from "../configs/api";

const mealTypeOptions = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
];

const mealIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Utensils,
};

const mealColors = {
  breakfast:
    "bg-amber-100 text-amber-600 dark:bg-amber-100/10 dark:text-amber-500",
  lunch:
    "bg-orange-100 text-orange-600 dark:bg-orange-100/10 dark:text-orange-500",
  dinner:
    "bg-indigo-100 text-indigo-600 dark:bg-indigo-100/10 dark:text-indigo-400",
  snack:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-100/10 dark:text-emerald-500",
};

const FoodLog = () => {
  const { allFoodLogs, setAllFoodLogs } = useAppContext();

  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    calories: 0,
    mealType: "",
  });
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const loadEntries = () => {
    const todaysEntries = allFoodLogs.filter(
      (e: FoodEntry) => e.createdAt?.split("T")[0] === today,
    );
    setEntries(todaysEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.calories ||
      formData.calories <= 0 ||
      !formData.mealType
    ) {
      return toast.error("Please enter valid data");
    }
    try {
      setLoading(true);
      const { data } = await api.post("/food-logs", { data: formData });
      const entryWithDate = { ...data, createdAt: new Date().toISOString() };
      setAllFoodLogs(prev => [...prev, entryWithDate]);
      setFormData({ name: "", calories: 0, mealType: "" });
      setShowForm(false);
      toast.success("Entry added successfully");
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to add entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this entry?",
      );
      if (!confirm) return;
      await api.delete(`/food-logs/${documentId}`);
      setAllFoodLogs((prev) =>
        prev.filter((entry) => entry.documentId !== documentId),
      );
    } catch (error: any) {
      toast.error("Failed to delete entry");
    }
  };

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);

  const groupedEntries = entries.reduce(
    (acc, entry) => {
      const type = entry.mealType.toLowerCase() as keyof typeof mealIcons;
      if (!acc[type]) acc[type] = [];
      acc[type].push(entry);
      return acc;
    },
    {} as Record<string, FoodEntry[]>,
  );

  const handleQuickAdd = (activityName: string) => {
    setFormData({ ...formData, mealType: activityName.toLowerCase() });
    setShowForm(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await api.post("/image-analysis", formData);
      const result = data.result;
      let mealType = "";

      const hour = new Date().getHours();
      if (hour >= 0 && hour < 12) {
        mealType = "breakfast";
      } else if (hour >= 12 && hour < 16) {
        mealType = "lunch";
      }
      if (hour >= 16 && hour < 18) {
        mealType = "snack";
      }
      if (hour >= 18 && hour < 24) {
        mealType = "dinner";
      }

      if (!mealType || !result.name || !result.calories) {
        return toast.error("Missing data");
      }

      // Save the result to the database

      const { data: newEntry } = await api.post("/food-logs", {
        data: { name: result.name, calories: result.calories, mealType },
      });
      
      setAllFoodLogs(prev => [...prev, newEntry]);
      toast.success("AI entry added");

      // reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    } finally {
      setLoading(false);
    }
    // Implement image analysis
  };

  useEffect(() => {
    loadEntries();
  }, [allFoodLogs]);

  return (
    <div className="page-container bg-slate-50 dark:bg-[#030712] min-h-screen text-slate-900 dark:text-slate-200 p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Food Log
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track your daily intake
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Today's Total
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalCalories} kcal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form and Quick Add */}
        <div className="lg:col-span-5 space-y-6">
          {!showForm ? (
            <div className="space-y-4">
              <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Quick Add
                </h3>
                <div className="flex flex-wrap gap-2">
                  {quickActivitiesFoodLog.map((activity) => (
                    <button
                      key={activity.name}
                      onClick={() => handleQuickAdd(activity.name)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
                    >
                      <span>{activity.emoji}</span> {activity.name}
                    </button>
                  ))}
                </div>
              </Card>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 text-lg rounded-2xl text-white border-none shadow-lg shadow-emerald-600/20"
                onClick={() => setShowForm(true)}
              >
                <PlusIcon className="size-5 mr-2" /> Add Food Entry
              </Button>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 text-lg rounded-2xl text-white border-none shadow-lg shadow-emerald-600/20"
                onClick={() => inputRef.current?.click()}
              >
                <SparkleIcon className="size-5 mr-2 text-white" /> AI Food Snap
              </Button>
            </div>
          ) : (
            <Card className="bg-white dark:bg-[#0f172a] border-emerald-500/50 p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                New Food Entry
              </h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <Input
                  label="Food Name"
                  value={formData.name}
                  onChange={(v) =>
                    setFormData({ ...formData, name: v.toString() })
                  }
                  placeholder="e.g., Chapathi"
                  required
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <Input
                  label="Calories"
                  type="number"
                  value={formData.calories}
                  onChange={(v) =>
                    setFormData({ ...formData, calories: Number(v) })
                  }
                  placeholder="250"
                  required
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <Select
                  label="Meal Type"
                  value={formData.mealType}
                  onChange={(v) =>
                    setFormData({ ...formData, mealType: v.toString() })
                  }
                  options={mealTypeOptions}
                  placeholder="Select meal type"
                  required
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white border-none"
                  >
                    Save Entry
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Right Column: Entries List */}
        <div className="lg:col-span-7">
          {entries.length === 0 ? (
            <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-center py-20 rounded-[2rem] shadow-sm dark:shadow-none">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
                <UtensilsCrossedIcon className="size-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No food logged today
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Start tracking your meals to stay on target
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {["breakfast", "lunch", "dinner", "snack"].map((type) => {
                if (!groupedEntries[type]) return null;
                const Icon = mealIcons[type as keyof typeof mealIcons];
                const mealTotal = groupedEntries[type].reduce(
                  (s, e) => s + e.calories,
                  0,
                );

                return (
                  <Card
                    key={type}
                    className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 p-0 overflow-hidden rounded-2xl shadow-sm dark:shadow-none"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${mealColors[type as keyof typeof mealColors]}`}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white capitalize">
                            {type}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {groupedEntries[type].length} items
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {mealTotal} kcal
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {groupedEntries[type].map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              {entry.name}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Today
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {entry.calories} kcal
                            </span>
                            <button
                              onClick={() =>
                                handleDelete(entry?.documentId || "")
                              }
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-400/10 rounded-lg transition-all"
                            >
                              <Trash2Icon size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={handleImageChange}
      />

      {loading && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-2xl">
            <Loader2Icon className="size-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-900 dark:text-white font-medium">
              Processing entry...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodLog;
