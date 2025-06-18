'use client';

import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { jackpotSchema } from "@/schemas/jackpotSchema";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { createJackpot, fetchAllJackpots } from "@/app/features/jackpot/jackpotSlice";
import SmarticoTypeSelector from "@/components/SmarticoTypeSelector";
import FormSelect from '@/components/FormSelect';
import { FormSelectOption } from '@/components/FormSelect';
import { SmarticoType, smarticoCodes } from "@/constants/smarticoTypes";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Play } from "@/app/features/jackpot/types";
import { toZonedTime, format } from 'date-fns-tz';
import { DateRange } from 'react-day-picker';
import { ThemeDatePicker } from '@/components/DatePicker/index';
import MultiGuessPlays, { MultiGuessPlay } from "@/components/MultiGuessPlays";

type JackpotFormData = yup.InferType<typeof jackpotSchema>;

type JackpotFormProps = {
    onClose: () => void;
};

type JackpotFormInputs = {
    jackpotDateRange: DateRange | undefined;
};

export default function JackpotForm({ onClose }: JackpotFormProps) {

    const convertToBrazilianFormat = (date: Date | string | null | undefined) => {
        if (!date) return '';

        const timezone = 'America/Sao_Paulo';
        const parsedDate = typeof date === 'string' ? new Date(date) : date;
        const zonedDate = toZonedTime(parsedDate, timezone);
        return format(zonedDate, 'yyyy-MM-dd HH:mm', { timeZone: timezone });
    };

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset
    } = useForm<JackpotFormData>({
        resolver: yupResolver(jackpotSchema) as any,
    });

    const jackpotTypeOptions: FormSelectOption<"single-guess-mode" | "all-open-mode">[] = [
        { label: "Palpite único", value: "single-guess-mode" },
        { label: "Palpite múltiplo", value: "all-open-mode" },
    ];

    const jackpotPrizeOptions: FormSelectOption<"Freebet" | "Saldo real">[] = [
        { label: "Freebet", value: "Freebet" },
        { label: "Saldo real", value: "Saldo real" },
    ];

    const [multiGuessPlays, setMultiGuessPlays] = useState<MultiGuessPlay[]>([]);

    const watchedHits = watch("hits");
    const watchedValue = watch("value");
    const jackpotType = watch("jackpotType");

    const prizeDescription =
        watchedHits && watchedValue
            ? `Ter ${watchedHits} / ${watchedHits} respostas corretas para partilhar R$${(watchedValue)}`
            : "";

    const [smarticoType, setSmarticoType] = useState<SmarticoType | ''>('');

    const dispatch = useAppDispatch();

    // Log the errors for debugging
    // console.log("Erros de validação:", errors);

    const onSubmit: SubmitHandler<JackpotFormData> = async (formData) => {

        try {

            if (!smarticoType) {
                console.error('Por favor selecione uma casa Smartico');
                return;
            }

            const smarticoCode = smarticoCodes[smarticoType];
            const finalPlays: Play[] = jackpotType === "all-open-mode"
                ? multiGuessPlays.map(play => ({
                    leagueId: play.leagueId,
                    homeTeam: play.homeTeam,
                    awayTeam: play.awayTeam,
                    country: play.country,
                    gameStartAt: convertToBrazilianFormat(play.gameStartAt),
                    gameEndAt: play.gameEndAt ? convertToBrazilianFormat(play.gameEndAt) : undefined,
                    template: play.template,
                }))
                : [{
                    leagueId: formData.LeagueId ?? '',
                    homeTeam: formData.homeTeam ?? '',
                    awayTeam: formData.awayTeam ?? '',
                    country: formData.country ?? '',
                    gameStartAt: formData.gameStartAt
                        ? convertToBrazilianFormat(formData.gameStartAt)
                        : '',
                    gameEndAt: formData.gameEndAt
                        ? convertToBrazilianFormat(formData.gameEndAt)
                        : undefined,
                    template: {
                        name: 'Palpite',
                        questions: [{
                            question_id: '1',
                            question_text: 'Quem vence a partida?',
                            question_type: 'which-the-winner',
                            options: { home: [], away: [] }
                        }]
                    }
                }];

            setValue("plays", finalPlays as any);

            // Log the final payload for debugging
            // console.log("Payload Final a enviar:", finalPlays);

            await dispatch(createJackpot({
                jackpotName: formData.jackpotName,
                jackpotStartDate: convertToBrazilianFormat(formData.jackpotStartDate),
                jackpotType: formData.jackpotType,
                prizes: [{
                    type: formData.prizes,
                    code_smartico: smarticoCode,
                    value: formData.value,
                    description: prizeDescription,
                    hits: formData.hits ?? 0
                }],
                plays: Array.isArray(finalPlays) ? finalPlays : [finalPlays],
            })).unwrap();

            await dispatch(fetchAllJackpots());

            // Reset form fields
            reset();
            setMultiGuessPlays([]);

        } catch (error: any) {
            alert(`Erro ao criar Jackpot: ${error.message || error}`);
        }

    };

    const handleAddPlay = () => {
        const currentPlay = {
            id: Date.now(),
            leagueId: watch("LeagueId") ?? '',
            homeTeam: watch("homeTeam") ?? '',
            awayTeam: watch("awayTeam") ?? '',
            country: watch("country") ?? '',
            hits: watch("hits") ?? 0,
            gameStartAt: watch("gameStartAt") ?? '',
            gameEndAt: watch("gameEndAt") ?? '',
            template: {
                name: 'Palpite',
                questions: [
                    {
                        question_id: '1',
                        question_text: 'Quem vence a partida?',
                        question_type: 'which-the-winner',
                        options: { home: [], away: [] }
                    }
                ]
            }
        };

        // validate if all required fields are filled
        if (
            currentPlay.leagueId &&
            currentPlay.homeTeam &&
            currentPlay.awayTeam &&
            currentPlay.gameStartAt &&
            currentPlay.country &&
            (currentPlay.hits ?? 0) > 0
        ) {
            setMultiGuessPlays(prev => [...(prev ?? []), currentPlay]);

            setValue("homeTeam", "");
            setValue("awayTeam", "");
            setValue("country", "");
            setValue("LeagueId", "");
            setValue("gameStartAt", "");
            setValue("gameEndAt", "");
            setValue("hits", 0);

        } else {
            alert("Preencha todos os campos obrigatórios do palpite antes de adicionar.");
        }
    };

    useEffect(() => {
        if (jackpotType === 'all-open-mode') {
            setValue('plays', multiGuessPlays);
        }
    }, [multiGuessPlays, jackpotType, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
                <div className="border-b border-[#282B38] mb-9 pb-12">
                    <div className="flex items-center mb-5 gap-14">
                        <h2 className="text-base/7 text-[14px] text-white">Informações Gerais do Jackpot</h2>
                        <SmarticoTypeSelector selected={smarticoType} onChange={(value) => setSmarticoType(value)} />
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-xs font-medium text-[#B0B6C9]">
                                Nome do Jackpot*
                            </label>
                            <div className="mt-2">
                                <div className=" w-[380px] h-[30px] flex items-center rounded-md bg-[#15161D] pl-3 outline-1 -outline-offset-1 outline-[#3A4052] ">
                                    <input
                                        {...register("jackpotName")}
                                        className=" py-1.5 pr-3 pl-1 text-base text-[#B0B6C9] placeholder:text-gray-400 focus:outline-none sm:text-xs"
                                    />
                                </div>
                            </div>
                            {errors.jackpotName && (
                                <p className="mt-2 text-[10px] text-[#FC830B]">
                                    {errors.jackpotName.message}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm/6 font-medium text-xs text-[#B0B6C9]">
                                Data de início do Jackpot*
                            </label>
                            <div className="mt-2 grid grid-cols-1 w-[380px] h-[30px]">
                                <input
                                    {...register("jackpotStartDate")}
                                    type="datetime-local"
                                    className="col-start-1 row-start-1 text-xs appearance-none rounded-md bg-[#15161D] py-1.5 pr-8 pl-3 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052]"
                                >
                                </input>
                            </div>
                            {errors.jackpotStartDate && (
                                <p className="mt-2 text-[10px] text-[#FC830B]">
                                    {errors.jackpotStartDate.message}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-4">
                            <label className="block text-xs font-medium text-[#B0B6C9]">
                                Tipo de Jackpot*
                            </label>
                            <div className="mt-2 grid grid-cols-1 w-[380px] h-[30px]">
                                <FormSelect<"single-guess-mode" | "all-open-mode">
                                    placeholder="Selecione o tipo de Jackpot"
                                    label=""
                                    value={watch("jackpotType")}
                                    onChange={(val) => setValue("jackpotType", val)}
                                    options={jackpotTypeOptions}
                                />
                            </div>
                            {errors.jackpotType && (
                                <p className="mt-2 text-[10px] text-[#FC830B]">
                                    {errors.jackpotType.message}
                                </p>
                            )}
                        </div>

                    </div>
                </div>

                <div className="relative flex items-center relative mb-5">
                    <h2 className="text-base text-white text-[14px]">Jogos</h2>
                </div>

                <div className="border border-[#3A4052] bg-[#1C1F29] rounded-md p-5 space-y-6">

                    <div className=" mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        <div className="sm:col-span-4">
                            <label htmlFor="street-address" className="block text-xs font-medium text-[#B0B6C9]">
                                Informações da partida
                            </label>
                            <div className="mt-2 w-[340px] h-[30px]">
                                <input
                                    {...register("LeagueId")}
                                    placeholder="Ex: Etapa 1"
                                    className="block rounded-md w-full bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="street-address" className="block text-xs font-medium text-[#B0B6C9]">
                                País / Região da Partida
                            </label>
                            <div className="mt-2 w-[340px] h-[30px]">
                                <input
                                    {...register("country")}
                                    placeholder="Ex: Internacional"
                                    className="block rounded-md w-full bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="city" className="block text-xs font-medium text-[#B0B6C9]">
                                Time da casa
                            </label>
                            <div className="mt-2 w-[340px] h-[30px]">
                                <input
                                    {...register("homeTeam")}
                                    type="text"
                                    placeholder="Ex: Benfica"
                                    className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="city" className="block text-xs font-medium text-[#B0B6C9]">
                                Time visitante
                            </label>
                            <div className="mt-2 w-[340px] h-[30px]">
                                <input
                                    {...register("awayTeam")}
                                    type="text"
                                    placeholder="Bayern"
                                    className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4 hidden">
                            <label htmlFor="last-name" className="block text-sm/6 font-medium text-[#B0B6C9]">
                                Descrição da premiação
                            </label>
                            <div className="mt-2">
                                <input
                                    name="description"
                                    type="text"
                                    readOnly
                                    placeholder="Ex: Ter 1 / 1 respostas corretas para partilhar R$ 100,00"
                                    value={prizeDescription}
                                    className="w-95 rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400   sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="city" className="block text-xs font-medium text-[#B0B6C9]">
                                Início da partida
                            </label>
                            {/* <Controller
                                name="jackpotStartDate"
                                control={control}
                                render={({ field }) => (
                                    <ThemeDatePicker
                                        mode="single"
                                        value={field.value as Date | undefined}
                                        onChange={field.onChange}
                                    />
                                )}
                            /> */}
                            <div className="mt-2 w-[340px] h-[30px]">
                                <input
                                    {...register("gameStartAt")}
                                    type="datetime-local"
                                    className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="city" className="block text-xs font-medium text-[#B0B6C9]">
                                Fim da partida
                            </label>
                            <div className="mt-2 mb-5 w-[340px] h-[30px]">
                                <input
                                    {...register("gameEndAt")}
                                    type="datetime-local"
                                    className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>

                            {jackpotType === 'all-open-mode' && (
                                <button
                                    type="button"
                                    onClick={handleAddPlay}
                                    className=" w-[340px] h-[30px] flex items-center justify-center rounded-md border border-[#858FAB] bg-[#1C1F29] text-xs text-[#D5D8E2] ">Salvar</button>
                            )}

                        </div>

                    </div>

                    {jackpotType === 'all-open-mode' && (
                        <MultiGuessPlays
                            plays={multiGuessPlays}
                            setPlays={setMultiGuessPlays}
                        />
                    )}

                </div>

            </div>

            <div className="border-b border-[#282B38] pb-12">
                <h2 className="text-[14px] text-white mt-10 ">Premiação</h2>
                <div className="sm:col-span-3 mt-5">
                    <label className="block text-xs font-medium text-[#B0B6C9]">
                        Tipo de prêmio*
                    </label>
                    <div className="mt-2 grid grid-cols-1 w-[380px] h-[30px]">
                        <FormSelect<"Freebet" | "Saldo real">
                            label=""
                            value={watch('prizes')}
                            onChange={(val) => setValue('prizes', val)}
                            options={jackpotPrizeOptions}
                        />
                    </div>
                    {errors.prizes && (
                        <p className="mt-2 text-[10px] text-[#FC830B]">
                            {errors.prizes.message}
                        </p>
                    )}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="sm:col-span-4">
                        <label htmlFor="value" className="block text-xs mt-1 font-medium text-[#B0B6C9]">
                            Valor do prêmio*
                        </label>
                        <div className="mt-2 relative w-[380px] h-[30px]">
                            <span className="absolute left-3 top-1/2 text-sm -translate-y-1/2 text-gray-400">R$</span>
                            <input
                                inputMode="decimal"
                                {...register("value")}
                                type="number"
                                step={0.01}
                                className="block w-full rounded-md bg-[#15161D] pl-10 pr-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                placeholder="0.000"
                            />
                        </div>
                        {errors.value && (
                            <p className="mt-2 text-[10px] text-[#FC830B]">
                                {errors.value.message}
                            </p>
                        )}
                    </div>

                    <div className="sm:col-span-4">
                        <label className="block text-xs font-medium text-[#B0B6C9]">
                            Quantidade de Acertos Necessários*
                        </label>
                        <div className="mt-2 grid grid-cols-1 w-[380px] h-[30px]">
                            <input
                                type="number"
                                {...register('hits', { valueAsNumber: true })}
                                placeholder="Ex: Quantos palpites precisam ser corretos para concorrer ao prêmio."
                                className="block w-full rounded-md w-10 bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-[10px]"
                            >
                            </input>
                        </div>
                        {errors.hits && (
                            <p className="mt-2 text-[10px] text-[#FC830B]">
                                {errors.hits.message}
                            </p>
                        )}
                    </div>

                </div>
            </div>

            <div className=" flex inline-flex items-center justify-between gap-x-6 w-full mt-3">

                <button type="button" onClick={onClose} className="mt-6 flex w-[220px] h-[30px] justify-center border border-[#282B38] rounded-md bg-[#15161D] px-3 py-2 text-xs text-[#667191] ">
                    Cancelar
                </button>

                <button type="submit" className="mt-6 flex w-[220px] h-[30px] justify-center rounded-md bg-indigo-600 px-3 py-2 text-xs text-white bg-gradient-to-r from-red-500 to-orange-500">
                    Criar Bolão
                </button>

            </div>

        </form >
    )
}
