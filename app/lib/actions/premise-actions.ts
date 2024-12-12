'use server';

import { z } from "zod";
import { apiFetchServer } from "../api";
import { Premise } from "../definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { cookies } from "next/headers";

export type PremiseFormState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
  formData?: any | null;
};

const PremiseFormSchema = z.object({
  name: z.string({
    required_error: 'Por favor ingrese un nombre para el local.',
  }).min(1, { message: 'Por favor ingrese un nombre para el local.' }),
  logoImage: z.instanceof(File),
  privacyImage: z.instanceof(File),
});

export async function CreateOrUpdatePremise(prevState: PremiseFormState, formData: FormData) {
  const validatedFields = PremiseFormSchema.safeParse({
    name: formData.get('name'),
    logoImage: formData.get('premise-logo-image'),
    privacyImage: formData.get('premise-privacy-image'),
  });
  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      formData: Object.fromEntries(formData.entries()),
    };
  }

  const { name, logoImage, privacyImage } = validatedFields.data;

  try {
    const premiseId = formData.get('premise_id'); //On add this will be null
    const method = premiseId ? 'PUT' : 'POST';
    const path = premiseId ? `premise/${premiseId}` : 'premise/';

    const data: FormData = new FormData()
    data.append('name', name);

    if (logoImage.size > 0) {
      data.append('logo', logoImage);
    }

    if (privacyImage.size > 0) {
      data.append('privacy_policy', privacyImage);
    }
    const response = await apiFetchServer({ method: method, path: path, body: data, isForm: true });
    const responseJson: Premise = await response.data;

  } catch (error) {
    var errorText = 'Error inesperado';
    if (error instanceof Error) {
      errorText = error.message;
    }
    return {
      ...prevState,
      message: errorText, // Directly access 'error' or fallback
      formData: Object.fromEntries(formData.entries()),
    };
  }

  revalidatePath('/welcome/premises');
  redirect('/welcome/premises');
}

async function uploadCategoryImage(categoryId: number, file: File[]) {

  const formData = new FormData();
  for (let index = 0; index < file.length; index++) {
    const element = file[index];
    formData.append('files', element);
  }

  return await apiFetchServer({ method: 'POST', path: `category/${categoryId}/upload-file`, body: formData, isFileUpload: true });
}

async function removeCategoryImages(categoryId: number, imagesToRemove: string) {
  let imagesToRemoveArr = imagesToRemove.split(',');
  //TODO return responses from image removal
  for (let index = 0; index < imagesToRemoveArr.length; index++) {
    const imageRemoveResponse = await apiFetchServer({ method: 'DELETE', path: `category/${categoryId}/delete-file/` });
  }
}

export async function disablePremise(id: number) {
  try {
    const response = await apiFetchServer({ method: 'DELETE', path: `premise/${id}`, body: undefined });
    revalidatePath('/welcome/premises');
    return { message: 'Local deshabilitado.' };
  } catch (error) {
    return {
      message: 'Error al deshabilitar el local.',
    };
  }
}

export async function exportParticipantsToExcel(startDate?: string, endDate?: string,) {
  try {
    const cookieStore = await cookies();
    const query = new URLSearchParams();
    let premiseId = cookieStore.get('selectedPremise')?.value;
    if (!premiseId) {
      throw 'Error al detectar el local.'
    }
    if (startDate) {
      const startDateMontevideo = DateTime.fromISO(startDate, { zone: 'UTC' }).setZone('America/Montevideo').startOf('day');;
      query.append('date_from', startDateMontevideo.toISO()!);
    }
    if (endDate) {
      const endDateMontevideo = DateTime.fromISO(endDate, { zone: 'UTC' }).setZone('America/Montevideo').endOf('day');;
      query.append('date_to', endDateMontevideo.toISO()!);
    }
    const response = await apiFetchServer({ method: 'GET', path: `premise/${premiseId}/export`, body: undefined, query: query, isExcel: true, });
    return response.data;
  } catch (error) {
    throw error;
  }
}