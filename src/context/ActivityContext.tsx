import { ReactNode, createContext, useReducer, useMemo } from "react";
import { activityReducer, type ActivityActions, type ActivityState, initialState } from "../reducers/activity-reducer";
import type { Activity } from "../types";
import { categories } from "../data/categories";

type ActivityContextProps = {
    state: ActivityState;
    dispatch: React.Dispatch<ActivityActions>;
    caloriesConsumed: number;
    caloriesBurned: number;
    netCalories: number;
    categoryName: (category: Activity["category"]) => string[];
    isEmptyActivities: boolean;
};

type ActivityProviderProps = {
    children: ReactNode;
};

export const ActivityContext = createContext<ActivityContextProps>(null!); 

export const ActivityProvider = ({children} : ActivityProviderProps ) => {

    const [state, dispatch] = useReducer(activityReducer, initialState);

    	// Contadores
	const caloriesConsumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? total + activity.calories : total, 0), [state.activities]);
	const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? total + activity.calories : total, 0), [state.activities]);
    const netCalories = useMemo(() => caloriesConsumed - caloriesBurned, [state.activities]);

	const categoryName = useMemo(() => (category: Activity["category"]) => categories.map((cat) => (cat.id === category ? cat.name : "")), [state.activities]);
	const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities]);
    
    return(
        <ActivityContext.Provider
            value={{
                state,
                dispatch,
                caloriesConsumed,
                caloriesBurned,
                netCalories,
                categoryName,
                isEmptyActivities
            }}
        >
            {children}
        </ActivityContext.Provider>
    );
};