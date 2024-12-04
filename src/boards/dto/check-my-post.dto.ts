
import { IsString } from "class-validator";

export class CheckMyPostDto {
    @IsString()
    readonly passwd: string;
}