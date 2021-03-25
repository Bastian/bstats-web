import * as dotenv from 'dotenv';
import "./global.css";

dotenv.config();

const {API_BASE_URL} = process.env;

export function getSession({ context }) {
    return { API_BASE_URL };
}
