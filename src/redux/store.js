import { configureStore } from '@reduxjs/toolkit';
import systemReducer from './slices/systemSlice';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    system: systemReducer,
    auth: authReducer,
    settings: settingsReducer,
  },
});


// The following type aliases are only valid in TypeScript files.
// Since this is a JavaScript file, we remove them to fix the lint errors.
