import * as yup from 'yup';

export const superOddSchema = yup.object().shape({
 
  _id: yup.string().nullable().optional(),
  bannerSrc: yup.string().nullable().optional(),

  participants: yup.object().shape({
    homeName: yup.string().required('Nome do time da casa é obrigatório.'),
    awayName: yup.string().required('Nome do time visitante é obrigatório.'),
  }).required('Informações dos participantes são obrigatórias.'),

  eventStartDate: yup
    .date()
    .typeError('Data de início do evento é obrigatória.')
    .nullable()
    .required('Data de início do evento é obrigatória.'),

  oddLink: yup.string().url('Formato de link inválido.').required('Link da SuperOdd é obrigatório.'),

  odd: yup.object().shape({
    normal: yup.string().required('Odd Normal é obrigatória').typeError('Odd Normal deve ser uma string.'),
    super: yup.string().required('Odd Turbinada é obrigatória').typeError('Odd Turbinada deve ser uma string.'),
  }).required('Informações de Odd são obrigatórias.'),

  maxValue: yup.number()
    .typeError('Valor máximo da aposta deve ser um número.')
    .positive('Valor máximo da aposta deve ser positivo.')
    .required('Valor máximo da aposta é obrigatório.'),

  betSlipLine: yup.object().shape({
    type: yup.mixed<'anyToScore' | 'firstToScore' | 'toAssist'>()
      .oneOf(['anyToScore', 'firstToScore', 'toAssist'], 'Tipo de aposta inválido.')
      .required('Tipo de aposta é obrigatório.'),
    description: yup.string().required('Descrição da aposta é obrigatória.'),
    author: yup.string().required('Nome do jogador/autor é obrigatório.'),
  }).required('Informações da linha de aposta são obrigatórias.'),

  
});

export type SuperOddFormData = yup.InferType<typeof superOddSchema>;