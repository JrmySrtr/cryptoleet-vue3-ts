import axios from "axios";
import { API_URL } from "@/app.config"
import useDeviceProvider from '@/providers/device.provider';

type Response = {
  status: number,
  data: any,
  errors: {
    [key: string]: string[]
  }
}

const useAPIConsumer = async (method: string, path: string, data: any):Promise<Response>  => {

      let fetcher: any = null;

      switch (method) {
        case "get":
          fetcher = axios.get;
        case "post":
          fetcher = axios.post;
      }
      
      const config = {
        headers: {
          ...axios.defaults.headers,
          'x-events': useDeviceProvider().eUID.value,
        }
      }
      const response = await fetcher(`${API_URL}${path}`, { data: data }, config)

      if (response.status === 200 && response.data.status) {
        return response.data
      }
      
      else return {
        status:  response.status || 500,
        data: response.data || {},
        errors: response.errors || false,
      }
}



export default useAPIConsumer;
