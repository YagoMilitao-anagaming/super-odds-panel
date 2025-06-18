import * as yup from 'yup';

export const jackpotSchema = yup.object({
  jackpotName: yup.string().required('Nome do Jackpot é obrigatório'),
  jackpotStartDate: yup
    .date()
    .typeError('Data de início é obrigatória')
    .nullable()
    .required('Data de início é obrigatória'),

  jackpotType: yup
    .mixed<'single-guess-mode' | 'all-open-mode'>()
    .oneOf(['single-guess-mode', 'all-open-mode'], 'Tipo inválido')
    .required('Tipo de Jackpot é obrigatório'),

  prizes: yup
    .mixed<'Freebet' | 'Saldo real'>()
    .oneOf(['Freebet', 'Saldo real'], 'Prêmio inválido')
    .required('Tipo de prêmio é obrigatório'),

  homeTeam: yup.string().when('jackpotType', {
    is: 'single-guess-mode',
    then: (schema) => schema.required('Time da casa é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),

  awayTeam: yup.string().when('jackpotType', {
    is: 'single-guess-mode',
    then: (schema) => schema.required('Time visitante é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),

  country: yup.string().when('jackpotType', {
    is: 'single-guess-mode',
    then: (schema) => schema.required('Região da partida é obrigatória'),
    otherwise: (schema) => schema.notRequired(),
  }),

  gameStartAt: yup.string().when('jackpotType', {
    is: 'single-guess-mode',
    then: (schema) => schema.required('Início da partida é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),

  gameEndAt: yup.string().notRequired(),

  LeagueId: yup.string().when('jackpotType', {
    is: 'single-guess-mode',
    then: (schema) => schema.required('ID da etapa é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),

  value: yup
    .number()
    .required('Valor do prêmio é obrigatório')
    .typeError('Valor deve ser um número')
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : value
    ),

  hits: yup.number()
    .typeError('Quantidade de acertos deve ser um número')
    .when('jackpotType', {
      is: 'single-guess-mode',
      then: (schema) => schema.required('Informe o número de acertos').min(1),
      otherwise: (schema) => schema.notRequired(),
    }),


  plays: yup.array().when('jackpotType', {
    is: 'all-open-mode',
    then: (schema) =>
      schema
        .of(
          yup.object().shape({
            homeTeam: yup.string().required(),
            awayTeam: yup.string().required(),
            country: yup.string().required(),
            leagueId: yup.string().required(),
            gameStartAt: yup.string().required(),
            gameEndAt: yup.string().required(),
            hits: yup.number().required(),
            template: yup.object().shape({
              name: yup.string().required(),
              questions: yup.array().of(
                yup.object().shape({
                  question_id: yup.string().required(),
                  question_text: yup.string().required(),
                  question_type: yup.string().required(),
                  options: yup.object().shape({
                    home: yup.array().of(yup.string()).required(),
                    away: yup.array().of(yup.string()).required(),
                  }).required(),
                })
              ).required(),
            }).required(),
          })
        )
        .min(1, 'Adicione pelo menos um jogo')
        .required('Jogos são obrigatórios'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export type JackpotFormData = yup.InferType<typeof jackpotSchema>;
