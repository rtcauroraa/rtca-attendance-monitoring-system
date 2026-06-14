import axios from "axios";

export const baseURL = 'http://rtca-e-monitoring-web-api.runasp.net'

const  axiosIntance= axios.create({
  baseURL: baseURL + '/api/',
  timeout: 60000
});

export default axiosIntance