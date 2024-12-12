'use server';

import { DateTime } from "luxon";
import { apiFetchServer } from "../api";

export async function exportParticipantsByPromotionToExcel(promotion_id: string, startDate?: string, endDate?: string,) {
    try {

        const query = new URLSearchParams();
        if (startDate) {
            const startDateMontevideo = DateTime.fromISO(startDate, { zone: 'UTC' }).setZone('America/Montevideo').startOf('day');;
            query.append('date_from', startDateMontevideo.toISO()!);
        }
        if (endDate) {
            const endDateMontevideo = DateTime.fromISO(endDate, { zone: 'UTC' }).setZone('America/Montevideo').endOf('day');;
            query.append('date_to', endDateMontevideo.toISO()!);
        }
        const response = await apiFetchServer({ method: 'GET', path: `promotion-participants/${promotion_id}/export`, body: undefined, query: query, isExcel: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}