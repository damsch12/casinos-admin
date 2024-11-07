import { API_HOST } from "@/app/lib/env";
import { auth } from '@/auth';
import { Session } from "next-auth";
import { cookies } from 'next/headers';

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
}

export async function apiFetch({ method = 'GET', path = '/', query, body, isForm = false, isFileUpload = false, withAuth = true, addPremisePath = false, }: Props) {
  var headers = new Headers({
    'Accept': 'application/json',
  },);

  if (!isForm && !isFileUpload) {
    headers.append('Content-type', 'application/json')
  }

  // if(withAuth){
  //   headers.append('Authorization', token ?? '');
  // }

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

  return response.json()
}

export async function apiFetchServer({ method = 'GET', path = '/', query, body, isForm = false, isFileUpload = false, withAuth = true, addPremisePath = false, }: Props) {
  const cookieStore = cookies();

  var headers = new Headers({
    'Accept': 'application/json'
  },);

  if (!isForm && !isFileUpload) {
    headers.append('Content-type', 'application/json')
  } else {
    console.log('--- IN CREATE PREMISE');
  }
  if (withAuth) {
    const session = await auth();
    // If user is not logged in session will be null
    if (session) {
      headers.append('Authorization', session.accessToken ?? '');
    }
  }

  if (addPremisePath) {
    let premiseId = cookieStore.get('selectedPremise')?.value;
    if (premiseId) {
      path = path + `${premiseId}`
    } else {
      console.log('No premise, ERROR');
    }
  }
  try {
    const response = await fetch(getFullPath(path) + (query ? (`?${query}`) : ''), {
      method: method,
      headers: headers,
      body: body
    });
    console.log('----');
    console.log('BACKEND RESPONSE FOR (' + getFullPath(path) + (query ? `?${query}` : '') + ')', response);
    // Check for successful status codes (2xx)
    if (!response.ok) {
      const errorResponse = await response.json();
      // If the response contains a 'detail' field, use it, otherwise fallback to a generic error
      const errorDetail = errorResponse.detail || 'Ha ocurrido un error inesperado.';
      throw new Error(errorDetail); // Throw error with the detail message
    }

    return response; // Return the successful response

  } catch (error) {
    console.log('API ERROR:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw { error: 'Error inesperado' }; 
  }
}

export function getFullPath(path?: string) {
  return API_HOST + (path ? path : '');
}




