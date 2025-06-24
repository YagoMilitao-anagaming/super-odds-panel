
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { SuperOddState, SuperOdds } from './types';
import { SuperOddFormData } from '@/schemas/superOddSchema';

const initialState: SuperOddState = {
  data: null,
  list: [],
  loading: false,
  error: null,
  success: false,
};

export const createSuperOdds = createAsyncThunk(
  'superodds/createSuperOdds',
  async (formData: SuperOddFormData, { rejectWithValue }) => {
    try {
      const payloadToBackend: Omit<SuperOdds, '_id' | 'bannerSrc'> = {
        odd: {
          normal: String(formData.odd.normal),
          super: String(formData.odd.super),
        },
        participants: {
          homeName: formData.participants.homeName,
          awayName: formData.participants.awayName,
        },
        oddLink: formData.oddLink, 
        maxValue: Number(formData.maxValue),
        betSlipLine: {
          type: formData.betSlipLine.type,
          description: formData.betSlipLine.description,
          author: formData.betSlipLine.author,
        },
        eventStartDate: formData.eventStartDate,
      };

      const response = await api.post('/super-odds', payloadToBackend);
      return response.data as SuperOdds;
    } catch (error: any) {
      console.error("Erro detalhado na thunk createSuperOdds:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Erro desconhecido ao criar SuperOdd');
    }
  }
);

export const uploadSuperOddBanner = createAsyncThunk(
    'superodds/uploadSuperOddBanner',
    async ({ id, file }: { id: string; file: File }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('banner', file);

            const response = await api.post(`/super-odds/upload/${id}`, formData, {
                headers: {
                    'Authorization': process.env.NEXT_PUBLIC_AUTH_TOKEN || '',
                },
            });

            return response.data as { bannerSrc: string; _id: string; };
        } catch (error: any) {
            console.error(`Erro no upload do banner para SuperOdd ${id}:`, error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Erro ao fazer upload do banner.');
        }
    }
);

export const fetchAllSuperOdds = createAsyncThunk(
    'superodds/fetchAllSuperOdds',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get('/super-odds');
        return response.data as SuperOdds[];
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao buscar SuperOdds');
      }
    }
  );
  
  export const fetchSuperOddById = createAsyncThunk(
    'superodds/fetchSuperOddById',
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await api.get(`/super-odds/${id}`);
        return response.data as SuperOdds;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao buscar SuperOdd');
      }
    }
  );
  
  export const deleteSuperOdd = createAsyncThunk(
    'superodds/deleteSuperOdd',
    async (superOddId: string, { rejectWithValue }) => {
      try {
        await api.delete(`/super-odds/${superOddId}`);
        return superOddId;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const updateSuperOdds = createAsyncThunk(
  'superodds/updateSuperOdds',
  async ({ id, formData }: { id: string; formData: SuperOddFormData }, { rejectWithValue }) => {
    try {

      const payloadToBackend: Omit<SuperOdds, '_id' > = {
        odd: {
          normal: String(formData.odd.normal),
          super: String(formData.odd.super),  
        },
        participants: {
          homeName: formData.participants.homeName,
          awayName: formData.participants.awayName,
        },
        oddLink: formData.oddLink,
        maxValue: Number(formData.maxValue),
        betSlipLine: {
          type: formData.betSlipLine.type,
          description: formData.betSlipLine.description,
          author: formData.betSlipLine.author,
        },
        eventStartDate: formData.eventStartDate,
        bannerSrc: formData.bannerSrc ?? undefined,
      };

      const response = await api.put<SuperOdds>(`/super-odds/${id}`, payloadToBackend);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar SuperOdd:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Erro desconhecido ao atualizar SuperOdd');
    }
  }
);
  
  const superOddSlice = createSlice({
    name: 'superOdds',
    initialState,
    reducers: {
      resetSuperOddState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
        state.data = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(createSuperOdds.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase(createSuperOdds.fulfilled, (state, action: PayloadAction<SuperOdds>) => {
          state.loading = false;
          state.data = action.payload;
          state.success = true;
          state.list.push(action.payload);
        })
        .addCase(createSuperOdds.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Erro ao criar SuperOdd';
        });
      
      builder
            .addCase(uploadSuperOddBanner.pending, (state) => {
            })
            .addCase(uploadSuperOddBanner.fulfilled, (state, action: PayloadAction<{ bannerSrc: string; _id: string; }>) => {
                const index = state.list.findIndex(odd => odd._id === action.payload._id);
                if (index !== -1) {
                    state.list[index].bannerSrc = action.payload.bannerSrc;
                }
                if (state.data && state.data._id === action.payload._id) {
                    state.data.bannerSrc = action.payload.bannerSrc;
                }
            })
            .addCase(uploadSuperOddBanner.rejected, (state, action) => {
            });

  
      builder
        .addCase(fetchAllSuperOdds.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllSuperOdds.fulfilled, (state, action: PayloadAction<SuperOdds[]>) => {
          state.loading = false;
          state.list = action.payload;
        })
        .addCase(fetchAllSuperOdds.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Erro ao buscar SuperOdds';
        });
  
      builder
        .addCase(fetchSuperOddById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSuperOddById.fulfilled, (state, action: PayloadAction<SuperOdds>) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchSuperOddById.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Erro ao buscar SuperOdd';
        });
  
      builder
        .addCase(deleteSuperOdd.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteSuperOdd.fulfilled, (state, action) => {
          state.loading = false;
          state.list = state.list.filter(j => j._id !== action.payload);
          state.success = true;
        })
        .addCase(deleteSuperOdd.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Erro ao excluir SuperOdd';
        });
      builder
            .addCase(updateSuperOdds.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateSuperOdds.fulfilled, (state, action: PayloadAction<SuperOdds>) => {
                state.loading = false;
                state.data = action.payload;
                state.success = true;
                const index = state.list.findIndex(odd => odd._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(updateSuperOdds.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Erro ao atualizar SuperOdd';
            });
    },
  });
  
  export const { resetSuperOddState } = superOddSlice.actions;
  export default superOddSlice.reducer;