// types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type HabitStackParamList = {
  HomePage: undefined;        
  CreateHabit: undefined;     
  TrackProgress: undefined;   
  ViewProgress: undefined;    
  Profile: undefined;         
};

export type RootStackParamList = {
  HabitStack: NavigatorScreenParams<HabitStackParamList>; // Define the stack navigator
};
