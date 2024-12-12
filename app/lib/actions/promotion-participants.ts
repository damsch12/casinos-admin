'use server';

import { DateTime } from "luxon";
import { apiFetchServer } from "../api";

export async function exportParticipantsByPromotionToExcel(promotion_id: string, startDate?: string) {
    try {

        const query = new URLSearchParams();
        if (startDate) {
            const startDateMontevideo = DateTime.fromISO(startDate, { zone: 'UTC' }).setZone('America/Montevideo').startOf('day');;
            query.append('date_from', startDateMontevideo.toISO()!);
        }
        const response = await apiFetchServer({ method: 'GET', path: `promotion-participants/${promotion_id}/export`, body: undefined, query: query, isExcel: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}