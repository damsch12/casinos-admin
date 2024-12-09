'use server';

import { apiFetchServer } from "../api";

export async function exportParticipantsToExcel(promotion_id: number) {
    try {
        const response = await apiFetchServer({ method: 'GET', path: `promotion-participants/${promotion_id}/export`, body: undefined });
        return { message: 'Promocion exportada.' };
    } catch (error) {
        return {
            message: 'Error al expoertar la promoción.',
        };
    }
}