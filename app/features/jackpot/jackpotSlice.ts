import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { JackpotState, JackpotPayload, JackpotResponse } from './types';

const initialState: JackpotState = {
  data: null,
  list: [],
  loading: false,
  error: null,
  success: false,
};

export const createJackpot = createAsyncThunk(
  'jackpot/createJackpot',
  async (jackpotData: JackpotPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/jackpots', jackpotData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao criar jackpot');
    }
  }
);

export const fetchAllJackpots = createAsyncThunk(
  'jackpot/fetchAllJackpots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/jackpots/read-all');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar jackpots');
    }
  }
);

export const fetchJackpotById = createAsyncThunk(
  'jackpot/fetchJackpotById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jackpots/read/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar jackpot');
    }
  }
);

export const deleteJackpot = createAsyncThunk(
  'jackpot/deleteJackpot',
  async (jackpotId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/jackpots/${jackpotId}`);
      return jackpotId;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePlayFromJackpot = createAsyncThunk(
  'jackpot/deletePlayFromJackpot',
  async (
    { jackpotId, playId }: { jackpotId: string; playId: string },
    { rejectWithValue }
  ) => {
    try {
      await api.delete(`/jackpots/${jackpotId}/plays/${playId}`);
      return { jackpotId, playId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao deletar o jogo');
    }
  }
);

const jackpotSlice = createSlice({
  name: 'jackpot',
  initialState,
  reducers: {
    resetJackpotState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJackpot.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createJackpot.fulfilled, (state, action: PayloadAction<JackpotResponse>) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(createJackpot.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Erro ao criar jackpot';
      });

    builder
      .addCase(fetchAllJackpots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJackpots.fulfilled, (state, action: PayloadAction<JackpotResponse[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllJackpots.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Erro ao buscar jackpots';
      });

    builder
      .addCase(fetchJackpotById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJackpotById.fulfilled, (state, action: PayloadAction<JackpotResponse>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchJackpotById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Erro ao buscar jackpot';
      });

    builder
      .addCase(deleteJackpot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJackpot.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(j => j.jackpotId !== action.payload);
        state.success = true;
      })
      .addCase(deleteJackpot.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Erro ao excluir jackpot';
      });

    builder
      .addCase(deletePlayFromJackpot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlayFromJackpot.fulfilled, (state, action) => {
        state.loading = false;
        const { jackpotId, playId } = action.payload;
        const jackpot = state.list.find(j => j.jackpotId === jackpotId);
        if (jackpot) {
          jackpot.plays = jackpot.plays.filter(play => play.playId !== playId);

          // if no plays left, remove the jackpot from the list
          if (jackpot.plays.length === 0) {
            state.list = state.list.filter(j => j.jackpotId !== jackpotId);
          }
        }
      })
      .addCase(deletePlayFromJackpot.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Erro ao excluir o jogo';
      });
  },
});

export const { resetJackpotState } = jackpotSlice.actions;
export default jackpotSlice.reducer;
