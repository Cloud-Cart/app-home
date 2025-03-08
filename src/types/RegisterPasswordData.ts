import {RegisterData} from "@/types/RegisterData";

export interface RegisterPasswordData extends RegisterData {
    password: string;
    confirmPassword: string;
}