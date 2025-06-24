'use client'; 

import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { superOddSchema, SuperOddFormData } from '@/schemas/superOddSchema';
import { useState, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import BetHouseypeSelector from '@/components/BetHouseTypeSelector';
import FormSelect from '@/components/FormSelect';
import { FormSelectOption } from '@/components/FormSelect';
import { BethouseType} from "@/constants/betHouseTypes";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast from 'react-hot-toast'; 
import { updateSuperOdds, createSuperOdds, fetchAllSuperOdds, uploadSuperOddBanner } from '../features/superOdd/superOddSlice';
import { SuperOdds } from '../features/superOdd/types';
import { formatDateTimeToInput } from '../utils/formatDateTimeToInput';

type SuperOddFormProps = {
    onClose: () => void;
    superOddToEdit: SuperOdds | null; 
};

export function SuperOddForm({ onClose, superOddToEdit }: SuperOddFormProps) {
    const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [betHouseType, setBetHouseType] = useState<BethouseType | ''>('cassino');

    const {
        register,
        control, 
        handleSubmit,
        formState: { errors },
        setValue, 
        reset,
        watch 
    } = useForm<SuperOddFormData>({
        resolver: yupResolver(superOddSchema) as any,
        defaultValues: {
            
            _id: superOddToEdit?._id || undefined, 
            bannerSrc: superOddToEdit?.bannerSrc || undefined,
            odd: {
                normal: superOddToEdit?.odd.normal || '', 
                super: superOddToEdit?.odd.super || '',   
            },
            participants: {
                homeName: superOddToEdit?.participants.homeName || '',
                awayName: superOddToEdit?.participants.awayName || '',
            },
            oddLink: superOddToEdit?.oddLink || '',
            maxValue: superOddToEdit?.maxValue || 0,
            betSlipLine: {
                type: superOddToEdit?.betSlipLine.type || 'anyToScore', 
                description: superOddToEdit?.betSlipLine.description || '',
                author: superOddToEdit?.betSlipLine.author || '',
            },
            eventStartDate: superOddToEdit?.eventStartDate ? new Date(superOddToEdit.eventStartDate) : undefined,         },
    });
    

    const watchedEventStartDate = watch('eventStartDate');
    const watchedBannerSrc = watch('bannerSrc');

    const superOddBetTypeOptions: FormSelectOption<"anyToScore" | "firstToScore" | "toAssist">[] = [
        { label: "Qualquer placar", value: "anyToScore" },
        { label: "Primeiro a marcar ", value: "firstToScore" },
        { label: "Assistencia ", value: "toAssist" },
    ];

    
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (superOddToEdit) {
            setBetHouseType('cassino');
        } else {
            setBetHouseType('cassino');
        }
    }, [superOddToEdit]);

     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedBannerFile(event.target.files[0]);
            // Importante: A URL do banner no RHF (formData.bannerSrc) não é atualizada aqui.
            // Ela será atualizada após o upload ou na remoção.
        } else {
            setSelectedBannerFile(null);
        }
    };
    
    const handleRemoveBanner = async () => {
        const currentSuperOddId = superOddToEdit?._id;
        if (!currentSuperOddId) {
            toast.error('SuperOdd não existe para remover o banner.');
            return;
        }

        if (!window.confirm("Tem certeza que deseja remover este banner? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            const currentFormData = watch(); 
            await dispatch(updateSuperOdds({
                id: currentSuperOddId,
                formData: { ...currentFormData, bannerSrc: undefined }
            })).unwrap();
            
            setValue('bannerSrc', undefined);
            setSelectedBannerFile(null);
            toast.success('Banner removido com sucesso!');
            await dispatch(fetchAllSuperOdds());
        } catch (error) {
            toast.error('Erro ao remover o banner.');
            console.error('Erro ao remover banner:', error);
        }
    };

    const handleTriggerFileInput = () => {
        document.getElementById('bannerFileInput')?.click();
    };

    const handleUploadBannerAfterCreate = async (superOddId: string, file: File) => {
        setIsUploadingBanner(true);
        try {
            const uploadResult = await dispatch(uploadSuperOddBanner({ id: superOddId, file: file })).unwrap();
            setValue('bannerSrc', uploadResult.bannerSrc);
            toast.success('Banner carregado e associado à nova SuperOdd!');
        } catch (error) {
            toast.error('Erro ao carregar banner para a nova SuperOdd.');
            console.error('Erro ao carregar banner para nova SuperOdd:', error);
        } finally {
            setIsUploadingBanner(false);
            setSelectedBannerFile(null);
        }
    };

   
    const onSubmit: SubmitHandler<SuperOddFormData> = async (formData) => {
        try {
            if (!betHouseType) {
                toast.error('Por favor selecione uma casa de apostas.');
                return;
            }

            let superOddId: string | undefined = superOddToEdit?._id;

            if (superOddToEdit && superOddToEdit._id) {
                await dispatch(updateSuperOdds({ id: superOddToEdit._id, formData: formData })).unwrap();
                toast.success('SuperOdd atualizada com sucesso!');
            } else {
                const newSuperOdd = await dispatch(createSuperOdds(formData)).unwrap();
                superOddId = newSuperOdd._id;
                toast.success('SuperOdd criada com sucesso!');
            }

            if (selectedBannerFile && superOddId) {
                await handleUploadBannerAfterCreate(superOddId, selectedBannerFile);
            } else {
                await dispatch(fetchAllSuperOdds());
            }

            onClose();
            reset();
            setSelectedBannerFile(null);
        } catch (error: any) {
            const backendErrorMessage = error.response?.data?.message;
            const errorMessage = backendErrorMessage || error.message || 'Erro desconhecido ao salvar SuperOdd.';
            toast.error(`Falha: ${errorMessage}`);
            console.error('Detalhes do erro na submissão:', error);
        }
    };

     const displayBannerSrc = selectedBannerFile ? URL.createObjectURL(selectedBannerFile) : (watchedBannerSrc || '/picture-box.svg');

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <h2 className="text-white text-[18px] mb-6">
                {superOddToEdit ? 'Editar SuperOdd' : 'Criar Nova SuperOdd'}
            </h2>

            <div className="space-y-12 overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar">

                <div className="border-b border-[#282B38] mb-5 pb-12">
                    <div className="flex items-center gap-14">
                        <h2 className="text-base/7 text-[14px] text-white">Informações da Partida</h2>
                        <BetHouseypeSelector selected={betHouseType} onChange={(value) => setBetHouseType(value)} />
                    </div>

                    <div className="text-[14px] text-white mt-10">
                    
                        <div className="sm:col-span-4 mt-5">
                            <div className="self-stretch h-[135px] w-[380px] relative bg-neutral-800 rounded-lg overflow-hidden">
                                <img
                                    src={displayBannerSrc}
                                    alt="Banner Preview"
                                    className="w-full h-full object-cover"
                                />

                                {!isUploadingBanner && (
                                    <div className="absolute right-2 top-2 inline-flex justify-end items-center gap-2">

                                        <button
                                            type="button"
                                            onClick={handleTriggerFileInput}
                                            className="h-6 px-3 py-[5px] bg-zinc-900 rounded-lg shadow-[0px_10px_10px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-gray-700 inline-flex justify-center items-center gap-1 text-slate-500 text-xs font-normal"
                                        >
                                            <img src={"/edit.svg"} className="w-3.5 h-3.5" alt="Editar Banner" />
                                            {watchedBannerSrc || selectedBannerFile ? 'Trocar' : 'Editar'}
                                        </button>
                                        
                                        {(watchedBannerSrc || selectedBannerFile) && (
                                            <button
                                                type="button"
                                                onClick={selectedBannerFile ? () => setSelectedBannerFile(null) : handleRemoveBanner}
                                                className="w-6 h-6 p-[5px] bg-zinc-900 rounded-md shadow-[0px_10px_10px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-gray-700 flex justify-center items-center"
                                            >
                                                <img src="/trash.svg" alt="Remover Banner" className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {isUploadingBanner && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <span className="text-white text-sm">Carregando Banner...</span>
                                    </div>
                                )}
                            </div>
                            <input
                                id="bannerFileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={isUploadingBanner}
                            />
                        </div>
                        
                        <div className="sm:col-span-4 mt-5">
                            <label htmlFor="participants.homeName" className="block text-xs font-medium text-[#B0B6C9]">
                                Time da casa*
                            </label>
                            <div className="mt-2 w-[380px] h-[30px]">
                                <input
                                    {...register("participants.homeName")}
                                    type="text"
                                    placeholder="Ex: São Paulo"
                                    className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>
                            {errors.participants?.homeName && (
                                <p className="mt-2 text-[10px] text-[#FF2741]">
                                    {errors.participants?.homeName.message}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-4 mt-5">
                            <label htmlFor="participants.awayName" className="block text-xs font-medium text-[#B0B6C9]">
                                Time Visitante*
                            </label>
                            <div className="mt-2 w-[380px] h-[30px]">
                                <input
                                    {...register("participants.awayName")}
                                    type="text"
                                    placeholder="Ex: Liverpool"
                                    className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>
                            {errors.participants?.awayName && (
                                <p className="mt-2 text-[10px] text-[#FF2741]">
                                    {errors.participants?.awayName.message}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-4 mt-5">
                            <label htmlFor="eventStartDate" className="block text-sm/6 font-medium text-xs text-[#B0B6C9]">
                                Data do Evento*
                            </label>
                            <div className="mt-2 grid grid-cols-1 w-[380px] h-[30px]">
                                <input
                                    {...register("eventStartDate")}
                                    type="datetime-local"
                                    className="col-start-1 row-start-1 text-xs appearance-none rounded-md bg-[#15161D] py-1.5 pr-8 pl-3 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052]"
                                    value={formatDateTimeToInput(watchedEventStartDate)}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            setValue('eventStartDate', new Date(e.target.value));
                                        }
                                    }}
                                />
                            </div>
                            {errors.eventStartDate && (
                                <p className="mt-2 text-[10px] text-[#FF2741]">
                                    {errors.eventStartDate.message}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-4 mt-5">
                            <label htmlFor="oddLink" className="block text-xs font-medium text-[#B0B6C9]">
                                Link da SuperOdd*
                            </label>
                            <div className="mt-2">
                                
                                    <input
                                        {...register("oddLink")}
                                        type="text"
                                        placeholder="Ex: https://www.seusite.com/superodd"
                                        className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                    />
                                
                            </div>
                            {errors.oddLink && (
                                <p className="mt-2 text-[10px] text-[#FF2741]">
                                    {errors.oddLink.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-b border-[#282B38] mb-9 pb-12">
                    <h2 className="text-base text-white text-[14px]">Cotações / Odds</h2>
                    <div className="mt-5 flex gap-x-3.5">
                        <div className="flex-1 min-w-0">
                            <label htmlFor="odd.normal" className="block text-xs mt-1 font-medium text-[#B0B6C9]">
                                Odd Normal*
                            </label>
                            <div className="mt-2 h-[30px]">
                                <input
                                    inputMode="decimal"
                                    {...register("odd.normal")}
                                    type="text"
                                    placeholder="Ex: 4.22"
                                    className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>
                            {errors.odd?.normal && (
                                <p className="mt-2 text-[10px] text-[#FF2741]">
                                    {errors.odd?.normal.message}
                                </p>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <label htmlFor="odd.super" className="block text-xs mt-1 font-medium text-[#B0B6C9]">
                                Odd Turbinada*
                            </label>
                            <div className="mt-2 h-[30px]">
                                <input
                                    inputMode="decimal"
                                    {...register("odd.super")}
                                    type="text"
                                    placeholder="Ex: 5.22"
                                    className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                />
                            </div>
                            {errors.odd?.super && (
                                <p className="mt-2 text-[10px] text-[#FF2741]">
                                    {errors.odd?.super.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-b border-[#282B38] pb-12">
                    <h2 className="text-[14px] text-white mt-10 ">Informações da Aposta</h2>

                    <div className="sm:col-span-4 mt-5">
                        <label htmlFor="maxValue" className="block text-xs font-medium text-[#B0B6C9]">
                            Valor Máximo da Aposta (em R$)*
                        </label>
                        <div className="mt-2 relative w-[380px] h-[30px]">
                            <span className="absolute left-3 top-[13px] text-sm -translate-y-1/2 text-gray-400 py-1.5">R$</span>
                            <input
                                inputMode="decimal"
                                {...register("maxValue")}
                                type="number"
                                step={0.01}
                                className="block w-full rounded-md bg-[#15161D] pl-10 pr-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                placeholder="Ex: R$50,00"
                            />
                        </div>
                        {errors.maxValue && (
                            <p className="mt-2 text-[10px] text-[#FF2741]">
                                {errors.maxValue.message}
                            </p>
                        )}
                    </div>

                    <div className="sm:col-span-4 mt-5">
                        <label htmlFor="betSlipLine.author" className="block text-xs font-medium text-[#B0B6C9]">
                            Nome do Jogador/Autor*
                        </label>
                        <div className="mt-2">
                            <div className=" w-[380px] h-[30px] flex items-center rounded-md bg-[#15161D] pl-3 outline-1 -outline-offset-1 outline-[#3A4052] ">
                                <input
                                    {...register("betSlipLine.author")}
                                    type="text"
                                    placeholder="Ex: Cristiano Ronaldo"
                                    className=" py-1.5 pr-3 pl-1 text-base text-[#B0B6C9] placeholder:text-gray-400 focus:outline-none sm:text-xs"
                                />
                            </div>
                        </div>
                        {errors.betSlipLine?.author && (
                            <p className="mt-2 text-[10px] text-[#FF2741]">
                                {errors.betSlipLine?.author.message}
                            </p>
                        )}
                    </div>

                    <div className="sm:col-span-4 mt-5">
                        <label htmlFor="betSlipLine.description" className="block text-xs font-medium text-[#B0B6C9]">
                            Descrição da Aposta*
                        </label>
                        <div className="mt-2 relative w-[380px] h-[30px]">
                            <input
                                {...register("betSlipLine.description")}
                                type="text"
                                className="block w-full rounded-md bg-[#15161D] px-3 py-1.5 text-base text-[#B0B6C9] outline-1 -outline-offset-1 outline-[#3A4052] placeholder:text-gray-400 sm:text-xs"
                                placeholder="Ex: Marcar a qualquer momento"
                            />
                        </div>
                        {errors.betSlipLine?.description && (
                            <p className="mt-2 text-[10px] text-[#FF2741]">
                                {errors.betSlipLine?.description.message}
                            </p>
                        )}
                    </div>

                    <div className="sm:col-span-4 mt-5">
                        <label htmlFor="betSlipLine.type" className="block text-xs font-medium text-[#B0B6C9]">
                            Tipo de Aposta*
                        </label>
                        <div className="mt-2 grid grid-cols-1 w-[380px] h-[30px]">
                            <Controller
                                name="betSlipLine.type"
                                control={control}
                                render={({ field }) => (
                                    <FormSelect<"anyToScore" | "firstToScore" | "toAssist">
                                        label=""
                                        placeholder="Selecione o tipo de aposta"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={superOddBetTypeOptions}
                                    />
                                )}
                            />
                        </div>
                        {errors.betSlipLine?.type && (
                            <p className="mt-2 text-[10px] text-[#FF2741]">
                                {errors.betSlipLine?.types?.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex inline-flex items-center justify-between gap-x-6 w-full mt-3 ">
                <button type="button" onClick={onClose}
                    className="mt-6 flex w-[220px] h-[30px] justify-center border border-[#282B38]
                                rounded-md bg-[#15161D] px-3 py-2 text-xs text-[#667191] "
                >
                    Cancelar
                </button>
                <button type="submit" className="mt-6 flex w-full justify-center
                rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-3 py-2 text-xs text-white"
                disabled={isUploadingBanner}
            >
                {isUploadingBanner ? 'Enviando Banner...' : (superOddToEdit ? 'Salvar Edição' : 'Criar SuperOdd')}
            </button>
            </div>
        </form>
    );
}

export default SuperOddForm