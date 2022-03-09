import axios from 'axios'

// Axios configuration
const axiosBaseURL = (axios.defaults.baseURL = 'http://localhost:8082')

export { axiosBaseURL }
