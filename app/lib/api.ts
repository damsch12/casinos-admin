'only server'
import { API_HOST } from "@/app/lib/env";
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { AxiosError, AxiosHeaders } from 'axios';
import axiosInstance from "@/axiosInstance";

interface Props {
  path?: string,
  method?: string,
  body?: string | FormData,
  query?: URLSearchParams,
  isForm?: boolean
  isFileUpload?: boolean
  withAuth?: boolean,
  isMultipartForm?: boolean,
  addPremisePath?: boolean,
  addPremiseQuery?: boolean,
  isExcel?: boolean
}

export async function apiFetch({ method = 'GET', path = '/', query, body, isForm = false, isFileUpload = false, withAuth = true, addPremisePath = false, }: Props) {
  var headers = new Headers({
    'Accept': 'application/json',
  },);

  if (!isForm && !isFileUpload) {
    headers.append('Content-type', 'application/json')
  }


  const response = await fetch(getFullPath(path) + (query ? ('?' + query) : ''),
    {
      method: method,
      headers: headers,
      body: body,
      cache: 'force-cache'
    }
  );
  //TODO handle status errors and trigger a dialog and log errors
  console.info("FETCH RESPONSE", response);

  return response
}

export async function apiFetchServer({ method = 'GET', path = '/', query, body, isForm = false, isFileUpload = false, withAuth = true, addPremisePath = false, addPremiseQuery = false, isExcel = false, }: Props) {
  const cookieStore = await cookies();

  var axiosHeaders = new AxiosHeaders({
    Accept: 'application/json',
  });

  if (!isForm && !isFileUpload) {
    axiosHeaders.set('Content-type', 'application/json')
  } else {
  }

  if (withAuth) {
    const session = await auth();
    // If user is not logged in session will be null
    if (session) {
      axiosHeaders.set('Authorization', session.accessToken ?? '')
    }
  }

  if (addPremisePath) {
    let premiseId = cookieStore.get('selectedPremise')?.value;
    if (premiseId) {
      path = path + `${premiseId}`
    } else {
    }
  }

  if (addPremiseQuery) {
    let premiseId = cookieStore.get('selectedPremise')?.value;
    if (premiseId) {
      query?.set('premise_id', premiseId);
    } else {
    }
  }
  try {
    const response = await axiosInstance({
      url: getFullPath(path) + (query ? (`?${query}`) : ''),
      method: method,
      headers: axiosHeaders,
      data: body,
      ...(isExcel ? { responseType: 'arraybuffer' } : {})
    });

    return response;

  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const responseData = error.response.data;
      if (responseData instanceof Uint8Array) {
        try {
          const decodedError = JSON.parse(new TextDecoder('utf-8').decode(responseData));
          if (decodedError.detail) {
            throw new Error(decodedError.detail);
          }
        } catch (parseError) {
          const errorMessage =
            parseError instanceof Error && parseError.message
              ? parseError.message
              : 'Ha ocurrido un error';
          throw new Error(errorMessage);
        }
      }
      else if (responseData && responseData.detail) {
        throw new Error(responseData.detail);
      }
    }

    throw new Error('Ha ocurrido un error inesperado');
  }
}

export function getFullPath(path?: string) {
  return API_HOST + (path ? path : '');
}




