import { useEffect, useState } from "react";
import { getMotivationalMessage } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import type { ActivityEntry, FoodEntry } from "../types";

import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";

import { HamburgerIcon, FlameIcon, Ruler, ScaleIcon, TrendingUpIcon, ZapIcon, ActivityIcon } from "lucide-react";
import CaloriesChart from "../assets/CaloriesChart";

const Dashboard = () => {
  const { user, allActivityLogs, allFoodLogs } = useAppContext();

  const [todayFood, setTodayFood] = useState<FoodEntry[]>([]);
  const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([]);

  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;

  // Load today data
  const loadUserData = () => {
    const today = new Date().toISOString().split('T')[0];

    const foodData = allFoodLogs.filter(
      (f: FoodEntry) => f.createdAt?.split('T')[0] === today
    );

    setTodayFood(foodData);

    const activityData = allActivityLogs.filter(
      (a: ActivityEntry) => a.createdAt?.split('T')[0] === today
    );

    setTodayActivities(activityData);
  };

  useEffect(() => {
    loadUserData();
  }, [allActivityLogs, allFoodLogs]);

  const totalCalories: number = todayFood.reduce(
    (sum, item) => sum + item.calories,
    0
  );

  const remainingCalories: number =
    DAILY_CALORIE_LIMIT - totalCalories;

  const totalActiveMinutes: number = todayActivities.reduce(
    (sum, item) => sum + item.duration,
    0
  );

  const totalBurned: number = todayActivities.reduce(
    (sum, item) => sum + (item.calories || 0),
    0
  );

  const motivation = getMotivationalMessage(
    totalCalories,
    totalActiveMinutes,
    DAILY_CALORIE_LIMIT
  );

  return (
    <div className="page-container bg-slate-50 dark:bg-[#030712] min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="dashboard-header bg-emerald-600 pb-24 p-6">
        <p className="text-emerald-100 text-sm font-medium">
          Welcome back
        </p>
        <h1 className="text-2xl font-bold mt-1 text-white">
          Hi there! 👋 {user?.username || "demo"}
        </h1>

        {/* Motivation Card */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{motivation.emoji}</span>
            <p className="text-white font-medium">
              {motivation.text}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Single Card Container for Progress Bars */}
      <div className="mt-[-70px] px-6 space-y-6 pb-10"> 
        <Card className="shadow-2xl w-full max-w-4xl mx-auto p-8 bg-white dark:bg-[#0f172a] border-none rounded-[2rem]">
          
          {/* Calories Consumed Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-orange-100/50 dark:bg-orange-100/10 flex items-center justify-center">
                <HamburgerIcon className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <div>
               <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Calories Consumed
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {totalCalories}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Limit
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {DAILY_CALORIE_LIMIT}
              </p>
            </div>
          </div>

          <div className="my-6">
            <ProgressBar
              value={totalCalories === 0 ? 0.5 : totalCalories}
              max={DAILY_CALORIE_LIMIT}
            />
          </div>

           <div className="mt-4 flex justify-between items-center mb-8">
            <div className="bg-emerald-100 dark:bg-emerald-500/10 px-4 py-2 rounded-xl">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {remainingCalories >= 0
                  ? `${remainingCalories} kcal remaining`
                  : `${Math.abs(remainingCalories)} kcal over`}
              </span>
            </div>

            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
              {Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}%
            </span>
          </div>

          {/* Divider Line to separate sections within the same card */}
          <div className="border-t border-slate-100 dark:border-slate-800 my-8" />

          {/* Calories Burned Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100/50 dark:bg-orange-100/10 flex items-center justify-center">
                <FlameIcon className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Calories Burned
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {totalBurned}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Goal
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {user?.dailyCalorieBurn || 400}
              </p>
            </div>
          </div>

          <div className="my-6">
            <ProgressBar
              value={totalBurned === 0 ? 0.5 : totalBurned}
              max={user?.dailyCalorieBurn || 400}
            />
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Active Minutes */}
          <Card className="bg-white dark:bg-[#0f172a] border-none shadow-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-blue-100/10 flex items-center justify-center">
                <ActivityIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Active</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalActiveMinutes}
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">minutes today</p>
          </Card>

          
          {/* Workouts Count */}
          <Card className="bg-white dark:bg-[#0f172a] border-none shadow-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100/50 dark:bg-purple-100/10 flex items-center justify-center">
                <ZapIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Workouts</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {todayActivities.length}
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">activities logged</p>
          </Card>
        </div>


        {/* Goal Card */}
        {user && (
          
          <div className="max-w-4xl mx-auto w-full">
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-none shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm">Your Goal</p>
                <p className="text-white font-semibold capitalize">
                  {user.goal === 'lose' && '🔥 Lose Weight'}
                  {user.goal === 'maintain' && '⚖️ Maintain Weight'}
                  {user.goal === 'gain' && '💪 Gain Muscle'}
                </p>
              </div>
            </div>
          </Card>
          </div>
        )}


        {/* Body Metrics Card */}
        {user && user.weight && (
          <Card className="bg-white dark:bg-[#0f172a] border-none shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100/50 dark:bg-indigo-100/10 flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  Body Metrics
                </h3>
                <p className="text-slate-400 text-sm">Your stats</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <ScaleIcon className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Weight
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {user.weight} kg
                </span>
              </div>

              {user.height && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Ruler className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Height
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {user.height} cm
                  </span>
                </div>
              )}

              {user.height && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-tight">
                      BMI
                    </span>
                    {(() => {
                      const bmi = (user.weight / Math.pow(user.height / 100, 2)).toFixed(1);
                      return (
                        <span className="text-2xl font-black text-emerald-500">
                          {bmi}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="flex-1 bg-blue-400 opacity-40"></div>
                    <div className="flex-1 bg-emerald-400"></div>
                    <div className="flex-1 bg-orange-400 opacity-40"></div>
                    <div className="flex-1 bg-red-400 opacity-40"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[11px] font-bold text-slate-400">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}


        {/* Quick Summary */}
        <Card className="bg-white dark:bg-[#0f172a] border-none shadow-xl max-w-4xl mx-auto">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">
            Today's Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Meals logged</span>
              <span className="font-bold text-slate-900 dark:text-white">{todayFood.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Total calories</span>
              <span className="font-bold text-slate-900 dark:text-white">{totalCalories} kcal</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Active time</span>
              <span className="font-bold text-slate-900 dark:text-white">{totalActiveMinutes} min</span>
            </div>
          </div>
        </Card>


        {/* Activity & Intake Graph */}
        <div className="max-w-4xl mx-auto w-full">
          <Card className="bg-white dark:bg-[#0f172a] border-none shadow-xl">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">
              This Week's Progress
            </h3>
            <CaloriesChart />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;