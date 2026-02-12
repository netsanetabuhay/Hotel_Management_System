// // lib/hooks/useApi.ts
// "use client"

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import api from '@/lib/axios';
// export const useApi = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const interceptor = api.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.isAuthError && error.redirectTo) {
//           router.push(error.redirectTo);
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       api.interceptors.response.eject(interceptor);
//     };
//   }, [router]);

//   return api;
// };