import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_DOMAIN,
  headers: {
      'Authorization': process.env.NEXT_PUBLIC_AUTH_TOKEN,
    },

}); 

export const auth = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${process.env.AUTH_TOKEN}`,
    },
    cache: 'no-store',
  };
};
